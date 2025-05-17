const express = require("express");
const { checkNotice } = require("../controllers/notification-controller");
const notificationRoutes = express.Router();

notificationRoutes.get("/", checkNotice);

module.exports = notificationRoutes;