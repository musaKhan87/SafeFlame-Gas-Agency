const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const { authRoutes } = require("./routes/auth-route");
const connectDb = require("./utils/db");
const bookingRoutes = require("./routes/booking-route");
const LogRoutes = require("./routes/logs-route");
const notificationRoutes = require("./routes/notification-route");
const adminRoutes = require("./routes/admin-route");
const { User } = require("./models/User");
const path=require("path")

const app = express();
connectDb();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:  [
      "http://localhost:5173", // Development
      "https://your-frontend-domain.com", // Production frontend URL
    ],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/logs", LogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------Deployment----------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api is Running");
  });
}


const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const phone = process.env.ADMIN_PHONE;
    const address = process.env.ADMIN_ADDRESS;

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        password,
        salt
      );

      const admin = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: "admin",
        verified:true,
      });

      await admin.save();
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

app.listen(PORT, () => {
  console.log("server start succussfully on port", PORT);
  createAdminUser();
});
