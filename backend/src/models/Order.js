const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail:    { type: String },
  items: [{
    productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:        String,
    image:       String,
    price:       Number,
    quantity:    Number,
    giftWrap:    { type: Boolean, default: false },
  }],
  shippingAddress: {
    name:    String,
    line1:   String,
    line2:   String,
    city:    String,
    state:   String,
    pincode: String,
    phone:   String,
  },
  subtotal:       Number,
  shippingCharge: { type: Number, default: 0 },
  giftWrapCharge: { type: Number, default: 0 },
  total:          Number,
  paymentMethod:  { type: String, default: 'razorpay' },
  paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status:         { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  notes:          String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
