# E-Commerce App

Full-stack e-commerce application built with Node.js, Express, MySQL, React, and Vite.

## Prerequisites
- Node.js >= 16
- MySQL server running locally

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials if needed.

5. Create the database and tables:
```bash
mysql -u root -p < database.sql
```

6. Seed sample data:
```bash
node seed.js
```

7. Start the backend server:
```bash
npm run dev
```

Server runs on http://localhost:5000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Features

- User registration and authentication
- Browse products by category
- Product search
- Product detail view
- Shopping cart management
- Checkout with shipping address
- Order confirmation

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get all categories
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get user cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
