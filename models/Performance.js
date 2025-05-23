const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  group:       { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  date:        { type: Date, required: true },
  venue:       { type: String, required: true },
  ticketsSold: { type: Number, default: 0 },
  revenue:     Number
}, { timestamps: true });

module.exports = mongoose.model('Performance', PerformanceSchema);
