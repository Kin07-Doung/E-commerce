const pool = require('../config/db');

const Cart = {
  async findByUser(userId) {
    const [rows] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);
    return rows;
  },

  async findItem(userId, productId) {
    const [rows] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows[0];
  },

  async addItem(userId, productId, quantity) {
    try {
      const [result] = await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        [userId, productId, quantity]
      );
      return result.insertId || (await this.findItem(userId, productId))?.id;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        const existing = await this.findItem(userId, productId);
        if (existing) {
          await pool.query(
            'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
            [quantity, existing.id]
          );
          return existing.id;
        }
      }
      throw err;
    }
  },

  async updateItem(id, quantity) {
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
      return true;
    }
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    return result.affectedRows > 0;
  },

  async removeItem(id) {
    const [result] = await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  async clearUserCart(userId) {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }
};

module.exports = Cart;
