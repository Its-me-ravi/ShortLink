const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
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

const Url = mongoose.model('Url', urlSchema);

