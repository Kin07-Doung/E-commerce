const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, [
  body('product_id').isInt().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { product_id, quantity } = req.body;
    await Cart.addItem(req.user.id, product_id, quantity);
    const items = await Cart.findByUser(req.user.id);
    res.status(201).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticate, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quantity } = req.body;
    await Cart.updateItem(req.params.id, quantity);
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Cart.removeItem(req.params.id);
    const items = await Cart.findByUser(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
