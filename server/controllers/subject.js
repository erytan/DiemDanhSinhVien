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
  const { sid } = req.params
  const response = await Subject.findByIdAndUpdate(sid, req.body, { new: true })
  return res.satus(200).json({
    mess: response ? true : false,
    updateSubject: response ? response : " Something went wrong",
  })
});

module.exports = {
  createSubjectAndSession,
};
