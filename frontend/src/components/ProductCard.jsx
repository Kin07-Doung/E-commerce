import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const { showError } = useAlert();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }
    if (product.stock <= 0) {
      showError('Out of stock');
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
           <img loading="lazy" src={product.image_url || 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20300%20300%22%3E%3Crect%20fill=%22%23e2e8f0%22%20width=%22300%22%20height=%22300%22/%3E%3Ctext%20fill=%22%2394a3b8%22%20font-family=%22sans-serif%22%20font-size=%2216%22%20x=%2250%25%22%20y=%2250%25%22%20text-anchor=%22middle%22%20dy=%22.3em%22%3ENo%20Image%3C/text%3E%3C/svg%3E'} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">Out of Stock</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-shrink-0 ml-2 p-1.5 rounded-lg transition-colors ${
                product.stock > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">{product.category_name || 'Uncategorized'}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
            <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;




