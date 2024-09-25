const Subject = require("../models/subject");
const Session = require("../models/session");
const asyncHandler = require("express-async-handler");

//Tạo môn học và thời gian làm việc
const createSubjectAndSession = asyncHandler(async (req, res) => {
  try {
    // Validate subjectname
    if (!req.body.subjectname || req.body.subjectname.trim() === "") {
      return res.status(400).json({
        mes: false,
        error: "Tên môn học không được để trống.",
      });
    }

    // Kiểm tra xem tên môn học có trùng không
    const existingSubject = await Subject.findOne({
      subjectname: req.body.subjectname.trim(),
    });
    if (existingSubject) {
      return res.status(400).json({
        mes: false,
        error: "Tên môn học đã tồn tại.",
      });
    }

    // Lấy tất cả các mã môn học đã có và tìm số lớn nhất
    const allSubjects = await Subject.find({}, { id_subject: 1 }).sort({
      id_subject: 1,
    });
    const allSessions = await Session.find({}, { id_session: 1 }).sort({
      id_session: 1,
    });

    // Tìm mã id_subject tiếp theo
    const nextSubjectId = findNextId(allSubjects.map((s) => s.id_subject), "CS");

    // Tìm mã id_session tiếp theo
    const nextSessionId = findNextId(allSessions.map((s) => s.id_session), "SS");

    // Tạo mới môn học
    const subject = new Subject({
      id_subject: nextSubjectId,
      subjectname: req.body.subjectname.trim(),
      description: req.body.description || "",
      countSession: req.body.countSession || "1",
    });

    // Lưu môn học vào cơ sở dữ liệu
    await subject.save();

    // Tạo mới buổi học
    const session = new Session({
      id_session: nextSessionId,
      subject: subject.id_subject,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      location: req.body.location,
    });

    // Lưu buổi học vào cơ sở dữ liệu
    await session.save();

    // Thêm buổi học vào danh sách buổi học của môn học
    subject.sessions.push(session.id_session);
    await subject.save();

    return res.status(200).json({
      mes: true,
      Subject: subject,
      Session: session,
    });
  } catch (error) {
    return res.status(500).json({
      mes: false,
      error: error.message,
    });
  }
});

// Hàm tìm ID tiếp theo
const findNextId = (existingIds, prefix) => {
  const numbers = existingIds
    .map((id) => parseInt(id.replace(prefix, ""), 10))
    .sort((a, b) => a - b);

  let nextId = 1;

  // Tìm lỗ hổng hoặc tăng dần
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== nextId) {
      break;
    }
    nextId++;
  }

  return `${prefix}${nextId.toString().padStart(5, "0")}`;
};

//get ds session từ subject
const getSessionsBySubject = asyncHandler(async (req, res) => {
  const { tid } = req.params;

  // Tìm môn học bằng ID và lấy danh sách các session liên quan
  const subject = await Subject.findOne({ id_subject: tid });

  if (!subject) {
    return res.status(404).json({ message: "Subject not found" });
  }

  // Nếu `subject.sessions` chứa các ID session
  const response = subject.sessions; // Nếu bạn lưu id_session ở đây

  return res.status(200).json({
    mess: response ? true : false,
    sessions: response ? response : "Something went wrong",
  });
});

//Update môn học
const updateSubject = asyncHandler(async (req, res) => {
  const { sid } = req.params;
  const response = await Subject.findOneAndUpdate(
    { id_subject: sid },
    req.body,
    {
      new: true,
    }
  );
  return res.status(200).json({
    mess: response ? true : false,
    updateSubject: response ? response : "Something went wrong",
  });
});

//get ds môn học
const getSubjects = asyncHandler(async (req, res) => {
  const response = await Subject.find();
  return res.status(200).json({
    mes: response ? true : false,
    subject: response ? response : " Something went wrong",
  });
});
//get 1 môn học
const getSubject = asyncHandler(async (req, res) => {
  const { sid } = req.params;
  try {
    const response = await Subject.findOne({ id_subject: sid });
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
//delete môn học
const deleteSubject = asyncHandler(async (req, res) => {
  const { sid } = req.params; // sid là id_subject

  try {
    // Kiểm tra xem subject có tồn tại không
    const subject = await Subject.findOne({ id_subject: sid });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    // Kiểm tra xem subject có dữ liệu trong trường session không
    if (subject.sessions && subject.sessions.length > 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete subject as it has associated sessions.",
      });
    }
    if (subject.sessions && subject.sessions.length == 1) {
      // Xóa các session liên quan
      await Session.deleteOne({ id_session: { $in: subject.sessions } });
    }

    // Xóa subject dựa trên id_subject
    const response = await Subject.findOneAndDelete({ id_subject: sid });

    return res.status(200).json({
      success: response ? true : false,
      message: response
        ? "Subject deleted successfully."
        : "Failed to delete subject.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
});

const updateSubjectAndSession = asyncHandler(async (req, res) => {
  const { sid, ssid } = req.params;

  try {
    // Tìm subject cần cập nhật
    const subject = await Subject.findOne({ id_subject: sid });

    // Tìm session cũ
    const oldSession = await Session.findOne({ id_session: ssid });

    // Cập nhật subject
    const updatedSubject = await Subject.findOneAndUpdate(
      { id_subject: sid },
      req.body,
      { new: true }
    );

    // Cập nhật session
    const updatedSession = await Session.findOneAndUpdate(
      { id_session: ssid },
      req.body,
      { new: true }
    );

    if (updatedSubject && updatedSession) {
      // Xóa session cũ khỏi mảng sessions của subject
      const sessionIndex = updatedSubject.sessions.indexOf(
        oldSession.id_session
      );
      if (sessionIndex > -1) {
        updatedSubject.sessions.splice(sessionIndex, 1);
      }

      // Thêm session mới vào mảng sessions của subject
      updatedSubject.sessions.push(updatedSession.id_session); // Giả sử mảng sessions lưu trữ ID của session
      await updatedSubject.save();
    }

    // Trả về response
    return res.status(200).json({
      success: true,
      updatedSubject,
      updatedSession,
    });
  } catch (error) {
    // Xử lý lỗi
    console.error("Error updating subject and session:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while updating subject and session",
    });
  }
});

module.exports = {
  createSubjectAndSession,
  updateSubject,
  getSubjects,
  getSubject,
  deleteSubject,
  updateSubjectAndSession,
  getSessionsBySubject,
};
