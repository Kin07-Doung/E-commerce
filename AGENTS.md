# AGENTS.md

## Project Overview

Full-stack e-commerce application built with Node.js/Express/MySQL (backend) and React/Vite/Tailwind CSS (frontend).

## Key Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview production build
```

### Backend (Node.js + Express)
```bash
cd backend
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5000, auto-restart)
npm start          # Start production server
```

### Database
```bash
mysql -u root -p < backend/database.sql   # Create tables
node backend/seed.js                      # Seed sample data
```

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, react-router-dom v6, react-helmet-async
- **Backend**: Node.js, Express, MySQL
- **Deployment**: `frontend/dist/` is the production build directory

## SEO Notes

- Site name: **Kin Shop**
- Live domain: https://e-order.student-edu.online/
- SEO component: `frontend/src/components/SEO.jsx` (uses react-helmet-async)
- Public assets in `frontend/public/` (robots.txt, sitemap.xml, og-image.svg)
- Auth/account pages have `noIndex` set to prevent indexing
- Product pages use Product JSON-LD structured data via the `structuredData` prop
- Organization JSON-LD schema injected on every page (default in SEO component)

## Admin Orders Bug Fix

- **Root cause**: `Order.findAll()` in `backend/src/models/Order.js` did not query `order_items` or join `users`, so `order.items` and `order.user` were always `undefined` on the frontend.
- **Fix**: Added `total_quantity` and `item_count` subqueries to `findAll()` and `findByUser()`, plus a `LEFT JOIN users` for customer names. Added an `orderBy` parameter to `findAll()` (default `'id ASC'` for ascending order IDs in admin). Updated `frontend/src/pages/AdminOrders.jsx` to display `order.total_quantity` with item count, and `frontend/src/pages/Orders.jsx` (user-facing) to use the new fields. Increased table cell padding from `px-5 py-3.5` to `px-6 py-4` for better readability.

## Admin Auth State Persistence Fix

- **Root cause**: On page refresh, React fires child component effects (e.g., `AdminLayout`'s `loadNotifications` API call) before parent effects (`AuthProvider`'s auth restore in `useEffect`). The admin API call fired without the auth token → backend returned 401 → Axios interceptor cleared localStorage and redirected to `/login`.
- **Fix**: Changed `frontend/src/context/AuthContext.jsx` to restore user/token synchronously via `useState` lazy initialization (`restoreAuth()`) instead of `useEffect`. This sets the Axios default `Authorization` header during the initial render, before any child component effects fire. `loading` state defaults to `false` (no async wait needed). Updated `frontend/src/components/AdminLayout.jsx` to check `loading` state with a spinner, and changed the `loadNotifications` `useEffect` dependency from `[]` to `[user]` so API calls only fire when the user is available.

## Admin Categories: Product Count Always 0

- **Root cause**: `Category.findAll()` and `Category.findById()` in `backend/src/models/Category.js` only did `SELECT * FROM categories` without counting associated products. The frontend expected a `product_count` field but received `undefined`, rendering `0`.
- **Fix**: Updated both queries to include `(SELECT COUNT(*) FROM products WHERE category_id = c.id) AS product_count` subquery. Frontend `AdminCategories.jsx` already displayed `cat.product_count || 0`, so no frontend changes were needed.
