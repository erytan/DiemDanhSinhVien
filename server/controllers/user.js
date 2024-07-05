const User = require("../models/user");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const xlsx = require("xlsx");

const importExcel = asyncHandler(async (req, res) => {
  try {
    // Đọc file excel
    const xlFile = xlsx.readFile("F:\\Luanvan\\1.xlsx");
    const sheet = xlFile.Sheets[xlFile.SheetNames[0]];
    const P_JSON = xlsx.utils.sheet_to_json(sheet);

    console.log("Data from Excel:", P_JSON); // Kiểm tra dữ liệu đọc từ file Excel
    let idCounter = 1;
    const usersToInsert = [];

    for (let index = 0; index < P_JSON.length; index++) {
      const user = P_JSON[index];
      const salt = bcrypt.genSaltSync(10);
      
      // Tạo mã số sinh viên (mssv) với số thứ tự tăng dần
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const prefix = `DH5${yearSuffix}`;
      const gmail = `@gmail.com`;
      const nextNumber = (index + 1).toString().padStart(5, "0");
      const hashedPassword = await bcrypt.hashSync(user.password=`${prefix}${nextNumber}`, salt);
      const id_user = idCounter++;
      const mssv = `${prefix}${nextNumber}`;
      const email = `${prefix}${nextNumber}${gmail}`;

      // Kiểm tra xem người dùng đã tồn tại chưa
      const existingUser = await User.findOne({ $or: [{ mssv }, { email }] });
      if (existingUser) {
        console.log(`User with mssv ${mssv} or email ${email} already exists. Skipping.`);
        idCounter++; // Giảm số đếm ID nếu bỏ qua người dùng hiện tại
        continue;
      }

      usersToInsert.push({
        id_user,
        mssv,
        firstname: user.firstname,
        lastname: user.lastname,
        email,
        mobile: user.mobile,
        password: hashedPassword,
        role: user.role || '2',
        address: user.address || []
      });
    }

    // Chèn dữ liệu vào MongoDB
    const result = await User.insertMany(usersToInsert);
    console.log("Insert Result:", result); // Kiểm tra kết quả chèn dữ liệu
    res.status(200).json(result);
  } catch (error) {
    console.error("Error inserting users:", error);
    res.status(500).json({ error: "Failed to insert users" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mess: "Missing",
    });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tách password and role ra khỏi responese
    const { password, role, resfreshToken, ...userData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // lưu refreshToken vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // lưu refreshToken vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid password");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password ");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // Lấy token từ cookie
    const cookies = req.cookies;

    // Kiểm tra xem refreshToken có tồn tại không
    if (!cookies || !cookies.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token found in cookies",
      });
    }

    // Xác thực refreshToken
    const rs = await jwt.verify(cookies.refreshToken, process.env.JWT_SECRET);

    // Tìm người dùng trong cơ sở dữ liệu dựa trên decoded._id và refreshToken
    const response = await User.findOne({ _id: rs._id, refreshToken: cookies.refreshToken });

    if (!response) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not matched',
      });
    }

    // Tạo accessToken mới
    const newAccessToken = generateAccessToken(response._id, response.role);

    return res.status(200).json({
      success: true,
      newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
  // Xóa rếh token ở db
  await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, {
    new :true
  }
  )
  // Xóa rếh token ở cookie trình duyệt
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:true
  })
  return res.status(200).json({
    success: true,
    mess:'Logout successfully'
  })
});
//client gửi gmail
//Server check email có hợp lệ hay không => gửi gmail + kèm theo link ( password change token)
//Client check email=> click link
//Client gửi api kemf token
//Check token có giống với token mà server gửi qua email hay không
//Change pasword
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link bên dưới để thay đổi mật khẩu của bạn. Link này sẽ hết hạn trong vòng 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Click Here </a>`;

  const data = {
    email, // Đây là người nhận email
    html,
  };

  const rs = await sendMail(data);

  return res.status(200).json({
    success: true,
    rs,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  console.log({ password, token });
  if (!password || !token) throw new Error("Missing input");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid password reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwrordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    mes: user ? "update password" : "something went wrong",
  });
});
const getUser = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    user: response,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("missing input id");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deleteUer: response
      ? `user with email : ${response.email} deleted !!`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id || Object.keys(req.body).length === 0) {
    throw new Error("Missing input id or body");
  }

  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");

  if (!response) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    success: true,
    updateUser: response,
  });
});
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params; // Sử dụng uid từ req.params

  if (!uid || Object.keys(req.body).length === 0) {
    throw new Error("Missing input id or body");
  }

  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role");

  if (!response) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    success: true,
    updateUser: response, // Thay đổi deleteUer thành updateUser
  });
});
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    mes: response ? true : false,
    updateAddress: response ? response : "Can not update address",
  });
});

module.exports = {
  importExcel,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgetPassword,
  resetPassword,
  getUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
};
