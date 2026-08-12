const pool = require('../config/db');

const Wishlist = {
  async findAll(userId) {
    const [rows] = await pool.query(`
      SELECT w.id as wishlist_id, w.created_at as added_at,
             p.id, p.name, p.price, p.image_url, p.stock, p.category_id, c.name as category_name
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);
    return rows;
  },

  async count(userId) {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM wishlist_items WHERE user_id = ?', [userId]);
    return rows[0].total;
  },

  async isInWishlist(userId, productId) {
    const [rows] = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows[0];
  },

  async add(userId, productId) {
    const [result] = await pool.query(
      'INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.affectedRows > 0;
  },

  async remove(userId, productId) {
    const [result] = await pool.query(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Wishlist;
