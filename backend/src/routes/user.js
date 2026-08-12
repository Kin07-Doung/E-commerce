const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Address = require('../models/Address');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional({ nullable: true }).isMobilePhone('any').withMessage('Valid phone number is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone } = req.body;
    const existing = await User.findByEmail(email);
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const updated = await User.updateProfile(req.user.id, { name, email, phone: phone || null });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const fullUser = await User.findByIdWithPassword(req.user.id);
    if (!fullUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullUser.provider !== 'email' || !fullUser.password) {
      return res.status(400).json({ message: 'Password cannot be changed for this account' });
    }

    const isMatch = await User.comparePassword(currentPassword, fullUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await User.updatePassword(req.user.id, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

const addressValidators = [
  body('label').optional({ nullable: true }).isLength({ max: 100 }).withMessage('Label must be 100 characters or fewer'),
  body('name').notEmpty().withMessage('Name is required'),
  body('address_line1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('postal_code').notEmpty().withMessage('Postal code is required'),
  body('country').notEmpty().withMessage('Country is required')
];

router.get('/addresses', async (req, res) => {
  try {
    const addresses = await Address.findAll(req.user.id);
    res.json(addresses);
  } catch (err) {
    console.error('Get addresses error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/addresses/default', async (req, res) => {
  try {
    const address = await Address.findDefault(req.user.id);
    if (!address) {
      return res.status(404).json({ message: 'No default address found' });
    }
    res.json(address);
  } catch (err) {
    console.error('Get default address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/addresses/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id, req.user.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(address);
  } catch (err) {
    console.error('Get address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/addresses', addressValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = req.body;
    const addressId = await Address.create({
      user_id: req.user.id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default
    });
    const address = await Address.findById(addressId, req.user.id);
    res.status(201).json(address);
  } catch (err) {
    console.error('Create address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/addresses/:id', addressValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { label, name, phone, address_line1, address_line2, city, state, postal_code, country } = req.body;
    const updated = await Address.update(req.params.id, { label, name, phone, address_line1, address_line2, city, state, postal_code, country });
    if (!updated) {
      return res.status(404).json({ message: 'Address not found' });
    }
    const address = await Address.findById(req.params.id, req.user.id);
    res.json(address);
  } catch (err) {
    console.error('Update address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/addresses/:id/default', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id, req.user.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    await Address.setDefault(req.user.id, req.params.id);
    const updated = await Address.findById(req.params.id, req.user.id);
    res.json(updated);
  } catch (err) {
    console.error('Set default address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/addresses/:id', async (req, res) => {
  try {
    const deleted = await Address.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error('Delete address error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
