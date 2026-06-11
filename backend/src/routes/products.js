const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/products  — list with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, featured, newIn, bestseller, sort = '-createdAt', limit = 24, page = 1, q } = req.query;
    const filter = { isPublished: true };
    if (category)    filter.categorySlug = category;
    if (featured === 'true')    filter.isFeatured   = true;
    if (newIn === 'true')       filter.isNewIn      = true;
    if (bestseller === 'true')  filter.isBestseller = true;

    if (q) {
      const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ name: new RegExp(esc, 'i') }, { tags: new RegExp(esc, 'i') }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
