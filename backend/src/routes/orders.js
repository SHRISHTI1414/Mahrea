const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

const authOptional = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}
  next();
};

router.post('/', authOptional, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shippingCharge, giftWrapCharge, total, guestEmail } = req.body;
    const order = await Order.create({
      user: req.user?.id,
      guestEmail,
      items,
      shippingAddress,
      subtotal,
      shippingCharge,
      giftWrapCharge,
      total,
    });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ user: id }).sort('-createdAt').lean();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
