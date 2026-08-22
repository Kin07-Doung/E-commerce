import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const ProductCard = ({ product, onAddToCart, wishlistIds, onToggleWishlist }) => {
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showError('Please login to add items to wishlist');
      return;
    }
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border-2 border-orange-100 shadow-sm hover:border-orange-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 wobble-hover p-1">
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 h-full">
          <img 
            loading="lazy" 
            src={product.image_url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%200%20300%20300%22%3E%3Crect fill=%22%23fef3c7%22 width=%22300%22 height=%22300%22/%3E%3Ctext fill=%22%23f59e0b%22 font-family=%22sans-serif%22 font-size=%2248%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E🍽️%3C/text%3E%3C/svg%3E'} 
            alt={product.name} 
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            type="button"
            className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all duration-300 ${
              wishlistIds && wishlistIds.has(product.id) 
                ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                : 'bg-white/90 text-orange-600 hover:bg-orange-50 hover:scale-110'
            }`}
            title={wishlistIds && wishlistIds.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlistIds && wishlistIds.has(product.id) ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            )}
          </button>

          {/* Stock Badges */}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              ⚡ Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Sold Out
            </span>
          )}

        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Name & Add to Cart */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
              {product.name}
            </h3>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300 ${
                product.stock > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center justify-between pt-2 border-t border-orange-100">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-orange-600">${parseFloat(product.price).toFixed(2)}</span>
              {product.old_price && (
                <span className="text-xs text-gray-400 line-through">${parseFloat(product.old_price).toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              {product.stock > 0 && product.stock < 20 && (
                <span className="text-xs text-amber-500">🔥</span>
              )}
            </div>
          </div>

          {/* Quick Add to Cart Button (Mobile Friendly) */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              Add to Cart
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;