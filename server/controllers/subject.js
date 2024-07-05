const Subject = require("../models/subject");
const Session = require("../models/session")
const asyncHandler = require("express-async-handler");


const createSubjectAndSession = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.subjectname || !req.body.date || !req.body.startTime || !req.body.endTime || !req.body.location) {
        throw new Error('Missing input: Required fields are subjectname, date, startTime, endTime, and location');
    }

    const { subjectname, description, date, startTime, endTime, location } = req.body;

    try {
        // Tạo mới môn học
        const subject = new Subject({
            subjectname,
            description
        });

        // Lưu môn học vào cơ sở dữ liệu
        await subject.save();

        // Tạo mới buổi học
        const session = new Session({
            subject: subject._id,
            date,
            startTime,
            endTime,
            location,
            
        });

        // Lưu buổi học vào cơ sở dữ liệu
        await session.save();

        // Thêm buổi học vào danh sách buổi học của môn học
        subject.sessions.push(session._id);
        await subject.save();

        return res.status(200).json({
            mes: true,
            Subject: subject,
            Session: session
        });
    } catch (error) {
        return res.status(500).json({
            mes: false,
            error: error.message
        });
    }
});
module.exports = {
    createSubjectAndSession
}
