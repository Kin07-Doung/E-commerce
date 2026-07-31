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
   },

   async findAll(page = 1, limit = 20) {
     const offset = (page - 1) * limit;
     const [rows] = await pool.query(
       'SELECT id, name, email, role, provider, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
       [limit, offset]
     );
     return rows;
   },

   async findAllCount() {
     const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
     return rows[0].total;
   },

    async updateRole(id, role) {
      const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
      return result.affectedRows > 0;
    },

    async update(id, { name, role }) {
      const [result] = await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
      if (role) {
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
      }
      return result.affectedRows > 0;
    },

    async deleteUser(id, currentUserId) {
      const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
      if (!user[0]) {
        return { deleted: false, message: 'User not found' };
      }
      if (id === currentUserId) {
        return { deleted: false, message: 'Cannot delete your own account' };
      }
      if (user[0].role === 'admin') {
        const [adminCount] = await pool.query('SELECT COUNT(*) AS total FROM users WHERE role = ?', ['admin']);
        if (adminCount[0].total <= 1) {
          return { deleted: false, message: 'Cannot delete the last admin' };
        }
      }
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return { deleted: true };
    }
  };

module.exports = User;
