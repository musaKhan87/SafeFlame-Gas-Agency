const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const asyncHandler = require("express-async-handler");


const JWT_SECRET = process.env.JWT_SECRET;

const authenticate =asyncHandler( async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Authentication required" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = { authenticate, isAdmin };
