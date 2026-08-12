import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Alert from '../components/ui/Alert';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/wishlist');
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user, navigate]);

  const handleRemove = async (wishlistId, productId) => {
    setRemovingId(productId);
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((i) => i.id !== productId));
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess('💔 Removed from wishlist');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return;
    setAddingToCart(product.id);
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('🛒 Added to cart!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const getCategoryEmoji = (categoryName) => {
    const emojis = {
      'bakery': '🍞',
      'dairy': '🥛',
      'meat': '🥩',
      'seafood': '🐟',
      'fruits': '🍎',
      'vegetables': '🥬',
      'organic': '🌿',
      'fresh': '✨',
      'seasonal': '🍂',
      'spices': '🌶️',
      'beverages': '🥤',
      'snacks': '🍿',
      'desserts': '🍰'
    };
    if (!categoryName) return '🏷️';
    const lowerName = categoryName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '🏷️';
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-red-200 p-12 text-center shadow-lg">
          <span className="text-6xl block mb-4">❌</span>
          <h3 className="text-xl font-bold text-red-600 mb-2">Failed to Load Wishlist</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={loadWishlist} 
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">❤️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
            <p className="text-sm text-gray-500">Your favorite food items</p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Items Saved</p>
            <p className="text-xl font-bold text-orange-600">{items.length}</p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-16 text-center shadow-lg">
          <span className="text-8xl block mb-6">💔</span>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-500 mb-6">Start saving your favorite food items for later</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 inline-flex items-center gap-2">
              <span>🍽️</span> Browse Food
            </Link>
            <Link to="/products?category=fresh" className="bg-white border-2 border-orange-200 text-orange-600 px-8 py-3 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 inline-flex items-center gap-2">
              <span>✨</span> Fresh Deals
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl border-2 border-orange-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Link to={`/products/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                  {product.image_url ? (
                    <img 
                      loading="lazy" 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(product.wishlist_id, product.id); }}
                    disabled={removingId === product.id}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {removingId === product.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-red-500 hover:text-red-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    )}
                  </button>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600">
                      <span>{getCategoryEmoji(product.category_name)}</span>
                      <span>{product.category_name || 'Food'}</span>
                    </span>
                  </div>

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Sold Out
                    </span>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                      ⚡ Only {product.stock} left
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-orange-600">${parseFloat(product.price).toFixed(2)}</span>
                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? '✓ In stock' : '✗ Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0 || addingToCart === product.id}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                    product.stock > 0 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95' 
                      : 'bg-gray-300 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {addingToCart === product.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : product.stock > 0 ? (
                    '🛒 Add to Cart'
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;