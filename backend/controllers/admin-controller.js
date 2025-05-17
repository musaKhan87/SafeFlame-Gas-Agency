const asyncHandler = require("express-async-handler");
const { Booking } = require("../models/Booking");
const { User } = require("../models/User");
const Notification = require("../models/Notification");
const { sendBookingStatusUpdateEmail } = require("../utils/emailService");
const path = require("path");

const pendingBooking = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get pending bookings error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const updateBooking = asyncHandler(async (req, res) => {
  try {
    const { status, remarks } = req.body;

    // Find booking
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    // Update booking
    booking.status = status;
    booking.remarks = remarks;
    booking.updatedAt = new Date();
    booking.updatedBy = req.userId;

    await booking.save();
    // Find the user who made the booking
    const user = await User.findById(booking.userId);

    // If rejected, return cylinders to user
    if (status === "rejected" && user) {
      user.cylindersRemaining += booking.quantity;
      await user.save();
    }

    // Send booking status update email if user exists
    if (user) {
      await sendBookingStatusUpdateEmail(user, booking);
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const setNotice = asyncHandler(async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = new Notification({
      title,
      message,
      type: type || "info",
      createdBy: req.userId,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      notificationId: notification._id,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { verified, remarks } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    booking.paymentStatus = verified ? "verified" : "rejected";
    booking.remarks = remarks || booking.remarks;
    booking.paymentVerifiedAt = new Date();
    booking.paymentVerifiedBy = req.userId;
    booking.updatedAt = new Date();
    booking.updatedBy = req.userId;

    if (!verified) {
      booking.status = "rejected";
      const user = await User.findById(booking.userId);
      if (user) {
        user.cylindersRemaining += booking.quantity;
        await user.save();
        await sendBookingStatusUpdateEmail(user, booking);
      }
    }

    await booking.save();
    res.json({
      success: true,
      message: verified ? "Payment verified successfully" : "Payment rejected",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const getPaymentProof = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || !booking.paymentProof) {
      return res
        .status(404)
        .json({ success: false, error: "Payment proof not found" });
    }
    res.redirect(booking.paymentProof); // Send Cloudinary image URL
  } catch (error) {
    console.error("Get payment proof error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


const getPaymentVerificationList = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({
      paymentMethod: "paytm",
      paymentStatus: "pending",
    }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get payment verification bookings error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


module.exports = { pendingBooking, updateBooking, getAllUsers, setNotice, getPaymentVerificationList, verifyPayment, getPaymentProof };
