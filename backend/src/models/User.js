const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findByGoogleId(googleId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
    return rows[0];
  },

  async findByResetToken(token) {
    const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, role, provider, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, email, password, provider = 'email', googleId = null }) {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, provider, google_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, provider, googleId]
    );
    return result.insertId;
  },

  async setResetToken(email, token, expires) {
    await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, expires, email]);
  },

  async resetPassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?', [hashedPassword, token]);
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
