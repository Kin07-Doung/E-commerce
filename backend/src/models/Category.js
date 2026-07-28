const pool = require('../config/db');

const Category = {
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY id ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },

  async findAllCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM categories');
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name }) {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return result.insertId;
  }
};

module.exports = Category;
