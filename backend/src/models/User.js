const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{
    label:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String,
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
