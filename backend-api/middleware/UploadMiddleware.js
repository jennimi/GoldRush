// backend-api/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log("📷 File received:", file.originalname, "ext:", ext);
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    console.log("⛔️ Rejected file:", ext);
    cb(new Error("Only JPG, JPEG, PNG allowed"), false);
  }
};

module.exports = multer({ storage, fileFilter });
