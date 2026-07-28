const pool = require('../config/db');

const Product = {
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  },

  async findAllCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM products');
    return rows[0].total;
  },

  async findById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  },

  async findByCategory(categoryId) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE category_id = ?',
      [categoryId]
    );
    return rows;
  },

  async create({ name, description, price, stock, category_id, image_url }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category_id ? parseInt(category_id) : null, image_url]
    );
    return result.insertId;
  },

  async update(id, { name, description, price, stock, category_id, image_url }) {
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock, category_id ? parseInt(category_id) : null, image_url, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Product;
