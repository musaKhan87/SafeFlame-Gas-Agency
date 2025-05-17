const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const { Booking } = require("../models/Booking");
const { sendBookingConfirmationEmail, sendAccountBalanceEmail } = require("../utils/emailService");

const booking = asyncHandler(async (req, res) => {
  try {
    const { quantity, address, paymentMethod, paymentReference } = req.body;

    // Get user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if user has any pending bookings
    const pendingBooking = await Booking.findOne({
      userId: req.userId,
      status: "pending",
    });

    if (pendingBooking) {
      return res.status(400).json({
        success: false,
        error:
          "You already have a pending booking. Please wait for it to be processed before booking again.",
      });
    }

    // Check if user has enough cylinders
    if (user.cylindersRemaining < quantity) {
      return res.status(400).json({
        success: false,
        error: "Not enough cylinders remaining in your allocation",
      });
    }

    // Create booking
    const booking = new Booking({
      userId: user._id,
      userName: user.name,
      quantity,
      address: address || user.address,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "verified" : "pending",
    });

    if (req.file && paymentMethod === "paytm") {
      booking.paymentProof = req.file.path; // This is the Cloudinary URL
      booking.paymentReference = paymentReference;
    }
    

    await booking.save();

    // Update user's cylinder count
    user.cylindersRemaining -= quantity;
    await user.save();

    await sendBookingConfirmationEmail(user, booking);

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      message: "Booking created successfully",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, error: error });
  }
});

const getHistory = asyncHandler(async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.userId }).sort({
        createdAt: -1,
      });

      res.json({ success: true, bookings });
    } catch (error) {
      console.error("Get booking history error:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
});

const checkPending = asyncHandler(async (req, res) => {
  try {
    const pendingBooking = await Booking.findOne({
      userId: req.userId,
      status: "pending",
    });

    res.json({
      success: true,
      hasPendingBooking: !!pendingBooking,
      pendingBooking: pendingBooking || null,
    });
  } catch (error) {
    console.error("Check pending booking error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const balance = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "cylindersAllocated cylindersRemaining"
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      balance: {
        allocated: user.cylindersAllocated,
        remaining: user.cylindersRemaining,
        used: user.cylindersAllocated - user.cylindersRemaining,
      },
    });
  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const emailBalance=asyncHandler(async (req,res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Send account balance email
    await sendAccountBalanceEmail(user);

    res.json({
      success: true,
      message: "Account balance email sent successfully",
    });
  } catch (error) {
    console.error("Email balance error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
})

module.exports = { booking, getHistory,checkPending,balance,emailBalance };
