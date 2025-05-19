const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL  // frontend URL

// Nodemailer transporter setup (Use Gmail or any SMTP)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password if 2FA enabled
  },
});

const Register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Basic validations
    if (!name || name.length < 4) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Name must be at least 4 characters long",
        });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error:
          "Password must be at least 6 characters and include both letters and numbers",
      });
    }

    if (!phone || phone.length < 10) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid phone number" });
    }

    if (!address) {
      return res
        .status(400)
        .json({ success: false, error: "Address is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      verified: false, // Add this field in User schema
    });

    await user.save();

    // Email verification token (valid for 1 hour)
    const emailToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const verifyURL = `${CLIENT_URL}/verify-email/${emailToken}`;

    // Send verification email if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verify Your Email - SafeFlame Gas Agency",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px;">
            <h2 style="color: #e74c3c;">SafeFlame Gas Agency - Email Verification</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with our SafeFlame Gas Agency. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyURL}" style="background-color: #e74c3c; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all;"><a href="${verifyURL}">${verifyURL}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Regards,<br>Gas Agency Team</p>
          </div>
        `,
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Continue with registration even if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.verified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    user.verified = true;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(400).json({ success: false, error: "Invalid or expired token" });
  }
});

const Login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    if (!user.verified) {
      return res.status(400).json({
        success: false,
        error: "Please verify your email before logging in",
        needsVerification: true,
      });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    // Return user data (without password)
    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const ResendVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.verified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    // Email verification token (valid for 1 hour)
    const emailToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const verifyURL = `${CLIENT_URL}/verify-email/${emailToken}`;

    // Send verification email if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verify Your Email - SafeFlame Gas Agency",
          html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e74c3c; border-radius: 5px;">
                  <h2 style="color: #e74c3c;">SafeFlame Gas Agency - Email Verification</h2>
                  <p>Hello ${user.name},</p>
                  <p>Please verify your email address by clicking the button below:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyURL}" style="background-color: #e74c3c; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
                  </div>
                  <p>Or copy and paste this link in your browser:</p>
                  <p style="word-break: break-all;"><a href="${verifyURL}">${verifyURL}</a></p>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you did not create an account, please ignore this email.</p>
                  <p>Regards,<br>Gas Agency Team</p>
                </div>
              `,
        });

        res.json({
          success: true,
          message: "Verification email resent successfully",
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        res.status(500).json({
          success: false,
          error: "Failed to send verification email",
        });
      }
    } else {
      res
        .status(500)
        .json({ success: false, error: "Email service not configured" });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

const getUser=asyncHandler(async (req,res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
})

const Logout=asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});


module.exports = { Register, Login, verifyEmail, ResendVerification,getUser,Logout };
