const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceType: { type: String },
  referrer: { type: String },
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
