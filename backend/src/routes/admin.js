const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

router.use(authenticate, authorizeAdmin);

const productValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const products = await Product.findAll(page, limit);
    const total = await Product.findAllCount();
    res.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', upload.single('image'), productValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, stock, category_id } = req.body;
    let image_url = '';
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const productId = await Product.create({ name, description, price, stock, category_id, image_url });
    const product = await Product.findById(productId);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/products/:id', upload.single('image'), productValidators, async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    let image_url = req.body.image_url || '';
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const updated = await Product.update(req.params.id, { name, description, price, stock, category_id, image_url });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/export/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    const categories = await Category.findAll();
    const categoryMap = {};
    categories.forEach(c => categoryMap[c.id] = c.name);

    const headers = ['ID', 'Name', 'Description', 'Price', 'Stock', 'Category', 'Image URL'];
    const rows = products.map(p => [
      p.id,
      p.name,
      (p.description || '').replace(/,/g, ';'),
      p.price,
      p.stock,
      categoryMap[p.category_id] || '',
      p.image_url || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/export/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    const headers = ['ID', 'Name'];
    const rows = categories.map(c => [c.id, c.name]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('categories.csv');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/import/products', csvUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const results = [];
    const categories = await Category.findAll();
    const categoryMap = {};
    categories.forEach(c => categoryMap[c.name.toLowerCase()] = c.id);

    const fileContent = req.file.buffer.toString('utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return res.status(400).json({ message: 'CSV file is empty or has no data rows' });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        row[header] = value.replace(/^"|"$/g, '').trim();
      });

      const name = row['Name'] || row['name'];
      const description = row['Description'] || row['description'] || '';
      const price = parseFloat(row['Price'] || row['price']);
      const stock = parseInt(row['Stock'] || row['stock']);
      const categoryName = (row['Category'] || row['category'] || '').toLowerCase();
      const image_url = row['Image URL'] || row['image_url'] || '';

      if (!name || isNaN(price) || isNaN(stock)) {
        results.push({ row: i + 1, status: 'error', message: 'Missing required fields' });
        continue;
      }

      let category_id = categoryMap[categoryName];
      if (!category_id && categoryName) {
        const catId = await Category.create(categoryName);
        categoryMap[categoryName] = catId;
        category_id = catId;
      }

      await Product.create({ name, description, price, stock, category_id, image_url });
      results.push({ row: i + 1, status: 'success', name });
    }

    res.json({ imported: results.filter(r => r.status === 'success').length, failed: results.filter(r => r.status === 'error').length, details: results });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ message: 'Import failed: ' + err.message });
  }
});

router.post('/import/categories', csvUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const results = [];
    const fileContent = req.file.buffer.toString('utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return res.status(400).json({ message: 'CSV file is empty or has no data rows' });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        row[header] = value.replace(/^"|"$/g, '').trim();
      });

      const name = row['Name'] || row['name'];
      if (!name) {
        results.push({ row: i + 1, status: 'error', message: 'Name is required' });
        continue;
      }

      try {
        await Category.create(name);
        results.push({ row: i + 1, status: 'success', name });
      } catch (err) {
        results.push({ row: i + 1, status: 'error', message: 'Category may already exist' });
      }
    }

    res.json({ imported: results.filter(r => r.status === 'success').length, failed: results.filter(r => r.status === 'error').length, details: results });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ message: 'Import failed: ' + err.message });
  }
});

router.post('/pos/checkout', [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('total').isFloat({ gt: 0 }).withMessage('Total must be greater than 0')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, shipping_address, payment_method, total } = req.body;

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product_id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const orderId = await Order.createPOS({
      total,
      shipping_address: shipping_address || 'Walk-in Customer',
      items,
      cashierId: req.user.id,
      paymentMethod: payment_method || 'cash'
    });

    const order = await Order.findWithItems(orderId);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const [productsRes, categoriesRes, ordersRes, allProductsRes] = await Promise.all([
      Product.findAll(1, 1000),
      Category.findAll(),
      Order.findAll(1, 1000),
      Product.findAll(1, 1000),
    ]);

    const products = productsRes;
    const categories = categoriesRes;
    const orders = ordersRes;
    const allProducts = allProductsRes;

    res.json({
      stats: {
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        revenue: orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
      },
      recentOrders: orders.slice(0, 5),
      lowStock: allProducts.filter(p => p.stock < 10).slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const orders = await Order.findAll(page, limit);
    const total = await Order.findAllCount();
    res.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await Order.updateStatus(req.params.id, status);
    const order = await Order.findWithItems(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
