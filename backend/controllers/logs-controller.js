const asyncHandler = require("express-async-handler");
const { Log } = require("../models/Log");

const checkLog = asyncHandler(async (req, res) => {
     try {
       const { action, details } = req.body;

       const log = new Log({
         action,
         details,
         timestamp: new Date(),
         user: req.userId || "unauthenticated",
       });

       await log.save();

       res.status(201).json({ success: true });
     } catch (error) {
       console.error("Logging error:", error);
       res.status(500).json({ success: false, error: "Server error" });
     }
});

module.exports = { checkLog };