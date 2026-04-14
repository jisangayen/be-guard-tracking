const Attendance = require("../models/attendance.model");
const { calculateHours } = require("../utils/calculateHours");

// ✅ Check-in
exports.checkIn = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const guardId = req.user.id;

    const existing = await Attendance.findOne({
      guardId,
      checkOutTime: null,
    });

    if (existing) {
      return res.status(400).json({ msg: "Already checked in" });
    }

    const record = await Attendance.create({
      guardId,
      checkInTime: new Date(),
      checkInLocation: { lat, lng },
    });

    // 🔥 emit AFTER record created
    const io = req.app.get("io");

    io.emit("guard-update", {
      type: "checkin",
      data: record,
    });

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Check-out
exports.checkOut = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const guardId = req.user.id;

    const record = await Attendance.findOne({
      guardId,
      checkOutTime: null,
    });

    if (!record) {
      return res.status(400).json({ msg: "No active session" });
    }

    record.checkOutTime = new Date();
    record.checkOutLocation = { lat, lng };

    record.totalHours = calculateHours(
      record.checkInTime,
      record.checkOutTime
    );

    await record.save();

    // 🔥 emit AFTER update
    const io = req.app.get("io");

    io.emit("guard-update", {
      type: "checkout",
      data: record,
    });

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get My Logs
exports.getMyLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({ guardId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Admin Dashboard (All Records with Check-in + Check-out)
exports.getAllStatus = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("guardId", "name email")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};