require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const createAdmin = require("./config/createAdmin");

// 🔥 NEW
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io accessible in controllers
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

connectDB().then(() => {
  createAdmin(); // 🔥 create admin on server start
});

app.use(cors({
  origin: "https://ui-guard-tracking.vercel.app",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;


// ✅ NEW
server.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);