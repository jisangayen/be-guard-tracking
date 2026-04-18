const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    guardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    checkInTime: Date,
    checkOutTime: Date,
    checkInLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
    checkOutLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
    totalHours: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
