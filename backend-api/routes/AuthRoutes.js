// backend-api/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const upload = require("../middleware/UploadMiddleware");

router.post("/register", upload.single("ktp"), authController.register);
router.post("/login", authController.login);

module.exports = router;
