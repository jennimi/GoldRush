// Setup express + middleware
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/", (req, res) => {
  res.send("🔥 Backend API for GoldRush is up and running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.message);
  res.status(500).json({ msg: err.message || "Server error" });
});

// ✅ MongoDB + START SERVER (letakkan paling bawah!)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB Connection Error:", err));
