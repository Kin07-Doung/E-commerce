const pool = require('../config/db');

const Category = {
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      'SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count FROM categories c ORDER BY id ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },

  async findAllCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM categories');
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count FROM categories c WHERE c.id = ?', [id]);
    return rows[0];
  },

  async create({ name, description, icon = '🏷️' }) {
    const [result] = await pool.query('INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)', [name, description, icon]);
    return result.insertId;
  }
};

module.exports = Category;
