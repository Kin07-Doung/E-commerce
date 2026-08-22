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
npm run dev        # Start dev server (http://localhost:5000)
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
