const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 0 },
  uniqueVisitorCount: { type: Number, default: 0 },
  visitsByDevice: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  referrers: { type: Map, of: Number },
  visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visit' }],
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url; // Ensure correct export of the Url model
