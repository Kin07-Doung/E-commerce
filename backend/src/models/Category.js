const pool = require('../config/db');

const Category = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
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
