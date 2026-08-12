const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const items = await Wishlist.findAll(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('Get wishlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const total = await Wishlist.count(req.user.id);
    res.json({ count: total });
  } catch (err) {
    console.error('Get wishlist count error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const existing = await Wishlist.isInWishlist(req.user.id, productId);
    if (existing) {
      await Wishlist.remove(req.user.id, productId);
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await Wishlist.add(req.user.id, productId);
    }
    const total = await Wishlist.count(req.user.id);
    res.json({ inWishlist: !existing, count: total });
  } catch (err) {
    console.error('Toggle wishlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    await Wishlist.remove(req.user.id, parseInt(req.params.productId));
    const total = await Wishlist.count(req.user.id);
    res.json({ count: total });
  } catch (err) {
    console.error('Remove wishlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
