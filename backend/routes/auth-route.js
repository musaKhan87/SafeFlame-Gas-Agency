const express = require("express");
const {
  Register,
  Login,
  verifyEmail,
  ResendVerification,
  getUser,
  Logout,
} = require("../controllers/auth-controller");
const { authenticate } = require("../middleware/auth");
const authRoutes = express.Router();

authRoutes.route("/register").post(Register);
authRoutes.route("/login").post(Login);
authRoutes.get("/verify-email/:token", verifyEmail);
authRoutes.post("/resend-verification", ResendVerification);
authRoutes.get("/me",authenticate, getUser);
authRoutes.post("/logout", Logout);
module.exports = { authRoutes };
