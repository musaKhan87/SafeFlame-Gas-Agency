const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

const checkNotice = asyncHandler(async (req, res) => {
     try {
       const notifications = await Notification.find()
         .sort({ createdAt: -1 })
         .limit(10);

       res.json({ success: true, notifications });
     } catch (error) {
       console.error("Get notifications error:", error);
       res.status(500).json({ success: false, error: "Server error" });
     }
})

module.exports = { checkNotice };