const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true, default: () => nanoid(6) },
  createdAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 0 }, // Total visits
  uniqueVisitorCount: { type: Number, default: 0 }, // Unique visitors
  visitsByDevice: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  referrers: { type: Map, of: Number }, // To track referrers
  visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visit' }], // Reference to visits
});

const visitSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceType: { type: String },
  referrer: { type: String },
});

const Visit = mongoose.model('Visit', visitSchema);
const Url = mongoose.model('Url', urlSchema);

