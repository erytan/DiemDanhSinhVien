  const mongoose = require("mongoose");

  const sessionSchema = new mongoose.Schema(
    {
      id_session: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        ref: "Subject",
      },
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      user: [
        {
          firstName: String,
          lastName: String,
          className: String,
          MSSV: String,
          attendanceCount: { type: Number, default: 0 },
          checkScanQR: { type: Boolean, default: false },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Session", sessionSchema);
