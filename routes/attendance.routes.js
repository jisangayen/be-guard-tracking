const express = require("express");
const router = express.Router();

const {
  checkIn,
  checkOut,
  getMyLogs,
  getAllStatus
} = require("../controllers/attendance.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my", protect, getMyLogs);
router.get("/status", protect, getAllStatus);

module.exports = router;