const pool = require('../config/db');

const Address = {
  async findAll(userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  },

  async findDefault(userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at FROM addresses WHERE user_id = ? AND is_default = 1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0];
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async create({ user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default }) {
    const [result] = await pool.query(
      'INSERT INTO addresses (user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, label, name, phone, address_line1, address_line2, city, state, postal_code, country, is_default ? 1 : 0]
    );
    return result.insertId;
  },

  async update(id, { label, name, phone, address_line1, address_line2, city, state, postal_code, country }) {
    const [result] = await pool.query(
      'UPDATE addresses SET label = ?, name = ?, phone = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE id = ?',
      [label, name, phone, address_line1, address_line2, city, state, postal_code, country, id]
    );
    return result.affectedRows > 0;
  },

  async setDefault(userId, id) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    const [result] = await pool.query('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  }
};

module.exports = Address;
