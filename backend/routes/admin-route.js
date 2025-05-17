const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  pendingBooking,
  updateBooking,
  getAllUsers,
  setNotice,
  getPaymentVerificationList,
  getPaymentProof,
  verifyPayment,
} = require("../controllers/admin-controller");
const adminRoutes = express.Router();

adminRoutes.get("/bookings/pending", authenticate, isAdmin, pendingBooking);

adminRoutes.put("/bookings/:id", authenticate, isAdmin, updateBooking);

adminRoutes.get("/users", authenticate, isAdmin, getAllUsers);

adminRoutes.post("/notifications", authenticate, isAdmin, setNotice);

adminRoutes.put(
    "/bookings/:id/verify-payment",
    authenticate,
    isAdmin,
    verifyPayment
);

adminRoutes.get(
  "/bookings/:id/payment-proof",
  authenticate,
  isAdmin,
  getPaymentProof
  
);

adminRoutes.get(
  "/bookings/payment-verification",
  authenticate,
  isAdmin,
  getPaymentVerificationList
);


module.exports = adminRoutes;
