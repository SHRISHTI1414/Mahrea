const router = require('express').Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('sortOrder').lean();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
