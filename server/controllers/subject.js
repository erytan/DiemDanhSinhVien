const Subject = require("../models/subject");
const Session = require("../models/session");
const asyncHandler = require("express-async-handler");

//Tạo môn học và thời gian làm việc
const createSubjectAndSession = asyncHandler(async (req, res) => {
  if (
    !req.body ||
    !req.body.subjectname ||
    !req.body.date ||
    !req.body.startTime ||
    !req.body.endTime ||
    !req.body.location
  ) {
    throw new Error(
      "Missing input: Required fields are subjectname, date, startTime, endTime, and location"
    );
  }

  try {
    // Tìm số lượng môn học và buổi học đã có để tăng dần
    const countSubjects = await Subject.countDocuments();
    const countSessions = await Session.countDocuments();

    // Tạo mã số mới cho môn học
    const prefixSubject = "CS";
    const nextNumberSubject = (countSubjects + 1).toString().padStart(5, "0");
    const id_subject = `${prefixSubject}${nextNumberSubject}`;

    // Tạo mới môn học
    const subject = new Subject({
      id_subject,
      subjectname: req.body.subjectname,
      description: req.body.description || "",
    });

    // Lưu môn học vào cơ sở dữ liệu
    await subject.save();

    // Tạo mã số mới cho buổi học
    const prefixSession = "SS";
    const nextNumberSession = (countSessions + 1).toString().padStart(5, "0");
    const id_session = `${prefixSession}${nextNumberSession}`;

    // Tạo mới buổi học
    const session = new Session({
      id_session,
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
//Update môn học
const updateSubject = asyncHandler(async (req, res) => {
  const { sid } = req.params;
  const response = await Subject.findByIdAndUpdate(sid, req.body, {
    new: true,
  });
  return res.status(200).json({
    mess: response ? true : false,
    updateSubject: response ? response : " Something went wrong",
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
    const response = await Subject.findById(sid);
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
  const { sid } = req.params;
  const response = await monhoc.findByIdAndDelete(sid);
  return res.status(200).json({
    mes: response ? true : false,
    updateBlog: response ? "Delete Successfully!!" : " Something went wrong",
  });
});
const updateSubjectAndSession = asyncHandler(async (req, res) => {
  const { sid, ssid } = req.params;

  try {
    // Update the Subject
    const updatedSubject = await Subject.findByIdAndUpdate(
      sid,
      req.body.subject,
      {
        new: true,
      }
    );

    // Update the Session
    const updatedSession = await Session.findByIdAndUpdate(
      ssid,
      req.body.session,
      {
        new: true,
      }
    );

    // Insert session into the sessions array of updated subject
    if (updatedSubject && updatedSession) {
      updatedSubject.sessions.push(updatedSession.id_session); // Assuming sessions array stores session IDs
      await updatedSubject.save();
    }

    // Return response
    return res.status(200).json({
      success: true,
      updatedSubject,
      updatedSession,
    });
  } catch (error) {
    // Handle errors
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
};
x