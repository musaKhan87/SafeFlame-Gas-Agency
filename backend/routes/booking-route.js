const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  booking,
  getHistory,
  checkPending,
  balance,
  emailBalance,
} = require("../controllers/booking-controller");
const bookingRoutes = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../utils/cloudinary");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-app",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `payment-${Date.now()}`,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

bookingRoutes.post("/", authenticate, upload.single("paymentProof"), booking);
bookingRoutes.get("/history", authenticate, getHistory);
bookingRoutes.get("/check-pending", authenticate, checkPending);
bookingRoutes.get("/balance", authenticate, balance);
bookingRoutes.post("/email-balance", authenticate, emailBalance);

module.exports = bookingRoutes;
