const router = require('express').Router();

// In-memory cart keyed by session token (replace with DB if needed)
// For production use a Cart model in MongoDB
const carts = {};

const getKey = (req) => req.headers['x-guest-id'] || req.headers.authorization?.split(' ')[1] || 'anon';

router.get('/', (req, res) => {
  const cart = carts[getKey(req)] || [];
  res.json({ cart });
});

router.post('/add', (req, res) => {
  const key = getKey(req);
  if (!carts[key]) carts[key] = [];
  const { productId, name, image, price, quantity = 1, giftWrap = false } = req.body;
  const existing = carts[key].find((i) => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else carts[key].push({ productId, name, image, price, quantity, giftWrap });
  res.json({ cart: carts[key] });
});

router.put('/update', (req, res) => {
  const key = getKey(req);
  const { productId, quantity } = req.body;
  if (!carts[key]) return res.json({ cart: [] });
  if (quantity <= 0) carts[key] = carts[key].filter((i) => i.productId !== productId);
  else {
    const item = carts[key].find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
  }
  res.json({ cart: carts[key] });
});

router.delete('/remove/:productId', (req, res) => {
  const key = getKey(req);
  if (carts[key]) carts[key] = carts[key].filter((i) => i.productId !== req.params.productId);
  res.json({ cart: carts[key] || [] });
});

router.delete('/clear', (req, res) => {
  carts[getKey(req)] = [];
  res.json({ cart: [] });
});

module.exports = router;
