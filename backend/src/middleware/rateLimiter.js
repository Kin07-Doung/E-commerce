const rateLimit = require('express-rate-limit');
const { createStore } = require('./mysqlStore');

const isLocalhost = (ip) => {
  if (!ip) return false;
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return true;
  if (ip.startsWith('127.') || ip.startsWith('::ffff:127.')) return true;
  return false;
};

const globalLimiter = rateLimit({
  store: createStore('global:'),
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 1 minute.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please try again after 1 minute.'
    });
  }
});

const authLimiter = rateLimit({
  store: createStore('auth:'),
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes.'
    });
  }
});

module.exports = { globalLimiter, authLimiter };
