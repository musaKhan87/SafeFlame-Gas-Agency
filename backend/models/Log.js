const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  details: {
    type: Object,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = { Log };