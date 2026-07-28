import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} ShopHub. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/products" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Products</Link>
          <Link to="/cart" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Cart</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
