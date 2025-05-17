const nodemailer = require("nodemailer");
const {
  bookingConfirmationTemplate,
  bookingStatusUpdateTemplate,
  accountBalanceTemplate,
} = require("./emailTemplates");

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password if 2FA enabled
    },
  });
};

const sendBookingConfirmationEmail = async (user, booking) => {
  // Skip if email credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email credentials not provided. Skipping email notification.");
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Gas Cylinder Booking Confirmation",
      html: bookingConfirmationTemplate(user, booking),
    });
    console.log(`Booking confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};

const sendBookingStatusUpdateEmail = async (user, booking) => {
  // Skip if email credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email credentials not provided. Skipping email notification.");
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Gas Cylinder Booking ${booking.status.toUpperCase()}`,
      html: bookingStatusUpdateTemplate(user, booking),
    });
    console.log(`Booking status update email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending booking status update email:", error);
  }
};

const sendAccountBalanceEmail = async (user) => {
  // Skip if email credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email credentials not provided. Skipping email notification.");
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Gas Agency Account Balance",
      html: accountBalanceTemplate(user),
    });
    console.log(`Account balance email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending account balance email:", error);
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendAccountBalanceEmail,
};
