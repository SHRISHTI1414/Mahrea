const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  tagline:     { type: String },
  bannerImage: { type: String },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
