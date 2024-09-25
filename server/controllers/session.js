const Session = require("../models/session");
const Subject = require("../models/subject");
const asyncHandler = require("express-async-handler");
const xlsx = require("xlsx");
//Tạo thời gian làm việc
const createSession = asyncHandler(async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Missing input: Request body is required",
      });
    }

    // Validate required fields
    const { date, startTime, endTime, location, id_subject } = req.body;
    if (!date || !startTime || !endTime || !location || !id_subject) {
      return res.status(400).json({
        success: false,
        error:
          "Missing input: Required fields are date, startTime, endTime, location, and id_subject",
      });
    }

    // Get all sessions and sort them by id_session
    const sessions = await Session.find().sort({ id_session: 1 });

    // Find the next available id_session
    let id_session = "SS00001";
    for (let i = 0; i < sessions.length; i++) {
      const expectedId = `SS${(i + 1).toString().padStart(5, "0")}`;
      if (sessions[i].id_session !== expectedId) {
        id_session = expectedId;
        break;
      }
    }
    if (id_session === "SS00001" && sessions.length > 0) {
      const lastId = parseInt(
        sessions[sessions.length - 1].id_session.substr(2)
      );
      id_session = `SS${(lastId + 1).toString().padStart(5, "0")}`;
    }

    // Find the subject by id_subject and update its sessions array
    const subject = await Subject.findOneAndUpdate(
      { id_subject },
      { $push: { sessions: id_session } },
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Create a new session document with id_session included
    const sessionData = {
      id_session,
      subject: id_subject,
      date,
      startTime,
      endTime,
      location,
      ...req.body, // Include any additional fields from req.body
    };
    const newSession = await Session.create(sessionData);

    // Return success response with the created session and updated subject
    return res.status(200).json({
      success: true,
      data: { newSession, updatedSubject: subject },
    });
  } catch (error) {
    // Log detailed error message for troubleshooting
    console.error("Error creating session:", error);

    // Return error response with generic message
    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

const getSessions = asyncHandler(async (req, res) => {
  const response = await Session.find();
  return res.status(200).json({
    mes: response ? true : false,
    session: response ? response : " Something went wrong",
  });
});
const updateSession = asyncHandler(async (req, res) => {
  const { sid } = req.params; // ID của session
  const { MSSV, attendanceCount } = req.body; // MSSV và số lượng điểm danh mới

  try {
    // Đảm bảo attendanceCount là số
    const newAttendanceCount = parseInt(attendanceCount, 10);

    // Kiểm tra dữ liệu
    console.log("Update data:", { sid, MSSV, newAttendanceCount });

    // Tìm và cập nhật đối tượng user trong mảng users
    const response = await Session.findOneAndUpdate(
      { id_session: sid, "user.MSSV": MSSV },
      {
        $set: {
          "user.$.attendanceCount": newAttendanceCount,
          "user.$.checkScanQR": true,
        },
      },
      { new: true }
    );

    if (!response) {
      return res
        .status(404)
        .json({ mess: false, message: "Session or user not found" });
    }

    return res.status(200).json({
      mess: true,
      updateSession: response,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return res
      .status(500)
      .json({ mess: false, message: "Something went wrong" });
  }
});
const updateUserSession = asyncHandler(async (req, res) => {
  try {
    // Cập nhật tất cả checkScanQR thành false cho tất cả người dùng trong tất cả sessions
    const response = await Session.updateMany(
      {},
      { $set: { "user.$[].checkScanQR": false } } // Cập nhật tất cả user
    );

    if (response.modifiedCount === 0) {
      return res.status(404).json({ mess: false, message: "Không có người dùng nào để cập nhật" });
    }

    return res.status(200).json({
      mess: true,
      message: "Đã reset checkScanQR cho tất cả người dùng",
      updatedCount: response.modifiedCount,
    });
  } catch (error) {
    console.error('Error resetting checkScanQR:', error);
    return res.status(500).json({ mess: false, message: "Có lỗi xảy ra" });
  }
});

//get ds môn học
const getSession = asyncHandler(async (req, res) => {
  const { ssid } = req.params;
  try {
    const response = await Session.findOne({ id_session: ssid });
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
const deleteSession = asyncHandler(async (req, res) => {
  const { sid, ssid } = req.params;

  try {
    // Tìm và xóa session với id_session là ssid
    const sessionResponse = await Session.findOneAndDelete({
      id_session: ssid,
    });

    if (!sessionResponse) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Cập nhật Subject để xóa session khỏi mảng sessions
    const updateResponse = await Subject.updateOne(
      { id_subject: sid },
      { $pull: { sessions: ssid } }
    );

    // Log số lượng tài liệu bị sửa đổi
    console.log("Number of documents modified:", updateResponse.modifiedCount);

    // Kiểm tra số lượng tài liệu bị sửa đổi
    if (updateResponse.modifiedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Session deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Session not found in the subject",
      });
    }
  } catch (error) {}
});
const importExcelToSessionUsers = async (req, res) => {
  const { sid } = req.params;
  try {
    // Kiểm tra xem session có tồn tại hay không
    const sessionExists = await Session.exists({ id_session: sid });
    if (!sessionExists) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy session với id_session ${sid}.`,
      });
    }

    // Đọc file Excel
    const workbook = xlsx.readFile("F:\\Luanvan\\2.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển đổi dữ liệu sheet thành JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    // Kiểm tra dữ liệu đã đọc từ file Excel
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu trong file Excel.",
      });
    }

    let updateResults = [];
    for (const item of data) {
      const { firstName, lastName, className, MSSV } = item;

      // Kiểm tra giá trị undefined hoặc null
      if (!firstName || !lastName || !className || !MSSV) {
        console.error(`Dữ liệu không hợp lệ: ${JSON.stringify(item)}`);
        updateResults.push({
          item,
          success: false,
          rs: "Dữ liệu không hợp lệ",
        });
        continue;
      }

      // Ghi log thông tin người dùng đang được thêm vào session
      console.log(
        `Đang thêm người dùng: ${firstName} ${lastName} - Lớp: ${className} - MSSV: ${MSSV}`
      );

      // Cập nhật session với thông tin người dùng
      const response = await Session.updateOne(
        { id_session: sid },
        {
          $addToSet: {
            user: {
              firstName,
              lastName,
              className,
              MSSV,
              attendanceCount: 0, // Set initial attendance count to 0
              checkScanQR: false,
            },
          },
        }
      );

      // Kiểm tra và ghi log kết quả cập nhật
      if (response) {
        console.log(`Đã thêm thành công người dùng: ${firstName} ${lastName}`);
        updateResults.push({
          item,
          success: true,
          rs: "Thêm thành công",
        });
      } else {
        console.error(`Không thể thêm người dùng: ${firstName} ${lastName}`);
        updateResults.push({
          item,
          success: false,
          rs: "Không thể thêm dữ liệu",
        });
      }
    }

    console.log("Dữ liệu đã được import thành công");
    return res.status(200).json({
      success: true,
      results: updateResults,
    });
  } catch (error) {
    console.error("Lỗi khi import dữ liệu:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi import dữ liệu",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSession,
  updateSession,
  getSessions,
  deleteSession,
  importExcelToSessionUsers,
  updateUserSession,
};
