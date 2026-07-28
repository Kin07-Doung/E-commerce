import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    if (product.stock <= 0) {
      alert('Out of stock');
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
           <img loading="lazy" src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
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
