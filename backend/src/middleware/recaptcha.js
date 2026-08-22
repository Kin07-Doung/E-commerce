const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  try {
    const token = req.body.recaptchaToken;
    if (!token) {
      return res.status(400).json({ message: 'reCAPTCHA verification is required' });
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    next();
  } catch (err) {
    console.error('reCAPTCHA error:', err.message);
    res.status(500).json({ message: 'reCAPTCHA verification error' });
  }
};

module.exports = { verifyRecaptcha };
