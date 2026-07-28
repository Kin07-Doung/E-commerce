require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await pool.query(`
      INSERT IGNORE INTO categories (name) VALUES 
      ('Electronics'), ('Clothing'), ('Books'), ('Home & Kitchen')
    `);

    const [categories] = await pool.query('SELECT id, name FROM categories');
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c.id);

    const products = [
      { name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation.', price: 79.99, stock: 50, category: 'Electronics', image: 'https://via.placeholder.com/500?text=Headphones' },
      { name: 'Smartphone', description: 'Latest model smartphone with amazing camera.', price: 699.99, stock: 30, category: 'Electronics', image: 'https://via.placeholder.com/500?text=Smartphone' },
      { name: 'Laptop', description: 'Powerful laptop for work and gaming.', price: 1299.99, stock: 20, category: 'Electronics', image: 'https://via.placeholder.com/500?text=Laptop' },
      { name: 'Cotton T-Shirt', description: 'Comfortable cotton t-shirt available in multiple colors.', price: 19.99, stock: 100, category: 'Clothing', image: 'https://via.placeholder.com/500?text=T-Shirt' },
      { name: 'Denim Jeans', description: 'Classic fit denim jeans.', price: 49.99, stock: 80, category: 'Clothing', image: 'https://via.placeholder.com/500?text=Jeans' },
      { name: 'Running Shoes', description: 'Lightweight running shoes for daily training.', price: 89.99, stock: 40, category: 'Clothing', image: 'https://via.placeholder.com/500?text=Shoes' },
      { name: 'JavaScript Guide', description: 'Complete guide to modern JavaScript.', price: 34.99, stock: 60, category: 'Books', image: 'https://via.placeholder.com/500?text=JS+Book' },
      { name: 'React Handbook', description: 'Master React with this comprehensive handbook.', price: 29.99, stock: 55, category: 'Books', image: 'https://via.placeholder.com/500?text=React+Book' },
      { name: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe.', price: 79.99, stock: 25, category: 'Home & Kitchen', image: 'https://via.placeholder.com/500?text=Coffee+Maker' },
      { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness.', price: 34.99, stock: 70, category: 'Home & Kitchen', image: 'https://via.placeholder.com/500?text=Desk+Lamp' }
    ];

    for (const p of products) {
      await pool.query(
        `INSERT IGNORE INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.price, p.stock, catMap[p.category], p.image]
      );
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Admin User', 'admin@example.com', hashedPassword, 'admin']
    );

    console.log('Seed data inserted successfully!');
    console.log('Admin user: admin@example.com / admin123');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
