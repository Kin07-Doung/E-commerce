const pool = require('../config/db');

class MysqlStore {
  constructor(keyPrefix = 'rl:') {
    this.prefix = keyPrefix;
    this.ready = false;
  }

  async init() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS rate_limits (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ip_key VARCHAR(255) UNIQUE NOT NULL,
          count INT NOT NULL DEFAULT 0,
          expires_at DATETIME NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_expires (expires_at),
          INDEX idx_ip_key (ip_key)
        )
      `);
      this.ready = true;
    } catch (err) {
      console.error('Failed to initialize rate_limits table:', err.message);
    }
  }

  async get(key) {
    if (!this.ready) await this.init();
    const fullKey = this.prefix + key;
    const [rows] = await pool.query('SELECT count, expires_at FROM rate_limits WHERE ip_key = ?', [fullKey]);
    if (rows.length === 0) return null;
    const row = rows[0];
    if (new Date(row.expires_at) < new Date()) {
      await this.delete(key);
      return null;
    }
    return { totalHits: row.count, resetTime: new Date(row.expires_at) };
  }

  async increment(key) {
    if (!this.ready) await this.init();
    const fullKey = this.prefix + key;
    const resetTime = new Date(Date.now() + 60 * 1000);
    await pool.query(
      'INSERT INTO rate_limits (ip_key, count, expires_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE count = count + 1, expires_at = VALUES(expires_at)',
      [fullKey, resetTime]
    );
    const [rows] = await pool.query('SELECT count, expires_at FROM rate_limits WHERE ip_key = ?', [fullKey]);
    return { totalHits: rows[0].count, resetTime: new Date(rows[0].expires_at) };
  }

  async decrement(key) {
    if (!this.ready) await this.init();
    const fullKey = this.prefix + key;
    await pool.query('UPDATE rate_limits SET count = GREATEST(count - 1, 0) WHERE ip_key = ?', [fullKey]);
  }

  async resetKey(key) {
    if (!this.ready) await this.init();
    const fullKey = this.prefix + key;
    await pool.query('DELETE FROM rate_limits WHERE ip_key = ?', [fullKey]);
  }

  async resetAll() {
    if (!this.ready) await this.init();
    await pool.query('DELETE FROM rate_limits');
  }
}

const createStore = (prefix) => new MysqlStore(prefix);

module.exports = { createStore };
