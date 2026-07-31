const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await User.create({ name, email, password });
    const user = await User.findById(userId);
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (googleRes.data.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { email, name, sub: googleId } = googleRes.data;
    let user = await User.findByGoogleId(googleId);

    if (!user) {
      user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: 'Email already registered with email/password. Please login instead.' });
      }
      const userId = await User.create({ name, email, password: crypto.randomBytes(16).toString('hex'), provider: 'google', googleId });
      user = await User.findById(userId);
    }

    const jwtToken = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: jwtToken });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await User.setResetToken(email, resetToken, resetTokenExpires);

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, password } = req.body;
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    await User.resetPassword(token, password);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
