const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    // required: true,
  },
  customers: {
    type: [String],
    default: ["NASA"],
  },
  upcoming: {
    type: Boolean,
    default: true,
  },
  success: {
    type: Boolean,
    default: false,
  },
});

// connects launchesSchema with "launches" collection (lowercase and pluralized)
module.exports = mongoose.model("launch", launchesSchema);
