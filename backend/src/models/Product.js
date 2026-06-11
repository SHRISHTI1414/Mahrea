const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  description:   { type: String },
  categorySlug:  { type: String, required: true },
  price:         { type: Number, required: true },
  discountPrice: { type: Number },
  images:        [{ type: String }],
  metal:         { type: String, enum: ['gold', 'silver', 'rose-gold', 'mixed'], default: 'gold' },
  tags:          [String],
  stock:         { type: Number, default: 0 },
  isFeatured:    { type: Boolean, default: false },
  isBestseller:  { type: Boolean, default: false },
  isNewIn:       { type: Boolean, default: false },
  isPublished:   { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
