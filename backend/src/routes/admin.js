const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error();
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Admin access required' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: 'admin' },
      process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [products, orders, users, revenue] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);
    res.json({ products, orders, users, revenue: revenue[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products CRUD
router.get('/products', adminAuth, async (req, res) => {
  const products = await Product.find().sort('-createdAt').lean();
  res.json({ products });
});

router.post('/products', adminAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ product });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Orders
router.get('/orders', adminAuth, async (req, res) => {
  const orders = await Order.find().sort('-createdAt').populate('user', 'name email').lean();
  res.json({ orders });
});

router.put('/orders/:id', adminAuth, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ order });
});

// Categories CRUD
router.get('/categories', adminAuth, async (req, res) => {
  const categories = await Category.find().sort('sortOrder').lean();
  res.json({ categories });
});

router.post('/categories', adminAuth, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ category: cat });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/categories/:id', adminAuth, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ category: cat });
});

module.exports = router;
