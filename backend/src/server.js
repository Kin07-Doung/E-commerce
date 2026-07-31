require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

async function start() {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  try {
    await db.query('SELECT 1');
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(start, 5000);
  }
}

start();
