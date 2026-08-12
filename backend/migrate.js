require('dotenv').config();
const pool = require('./src/config/db');

async function migrate() {
  try {
    const [cols] = await pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone'"
    );
    if (cols.length === 0) {
      await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(50)');
      console.log('Added column users.phone');
    } else {
      console.log('users.phone already exists');
    }

    await pool.query(`CREATE TABLE IF NOT EXISTS addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      label VARCHAR(100),
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      address_line1 VARCHAR(255) NOT NULL,
      address_line2 VARCHAR(255),
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100),
      postal_code VARCHAR(50) NOT NULL,
      country VARCHAR(100) NOT NULL,
      is_default BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id)
    )`);
    console.log('addresses table ready');

    await pool.query(`CREATE TABLE IF NOT EXISTS wishlist_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY unique_wishlist_item (user_id, product_id),
      INDEX idx_user (user_id)
    )`);
    console.log('wishlist_items table ready');

    await pool.end();
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

migrate();
