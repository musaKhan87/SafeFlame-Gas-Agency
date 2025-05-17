const express = require("express");
const { checkLog } = require("../controllers/logs-controller");
const LogRoutes = express.Router();

LogRoutes.post("/", checkLog);

module.exports = LogRoutes;