const pool = require('../config/db');

const Order = {
  async create(userId, { total, shipping_address, items }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)',
        [userId, total, shipping_address, 'pending']
      );
      const orderId = result.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async createPOS({ total, shipping_address, items, cashierId, paymentMethod }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO orders (user_id, total, shipping_address, status, payment_method) VALUES (?, ?, ?, ?, ?)',
        [cashierId || 0, total, shipping_address || 'Walk-in Customer', 'completed', paymentMethod || 'cash']
      );
      const orderId = result.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async findByUser(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(`
      SELECT o.id, o.user_id, o.total, o.shipping_address, o.status, o.payment_method, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    return rows;
  },

  async findByUserCount(userId) {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [userId]);
    return rows[0].total;
  },

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(`
      SELECT o.id, o.user_id, o.total, o.shipping_address, o.status, o.payment_method, o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  },

  async findAllCount() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM orders');
    return rows[0].total;
  },

  async findWithItems(id) {
    const [orders] = await pool.query(`
      SELECT o.id, o.user_id, o.total, o.shipping_address, o.status, o.created_at
      FROM orders o
      WHERE o.id = ?
    `, [id]);
    const order = orders[0];
    if (!order) return null;

    const [items] = await pool.query(`
      SELECT oi.product_id, oi.quantity, oi.price, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    return { ...order, items };
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Order;
