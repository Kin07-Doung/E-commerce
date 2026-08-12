import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));

    if (user) {
      api.get('/wishlist').then(res => {
        const ids = new Set((res.data || []).map(p => p.id));
        setInWishlist(ids.has(parseInt(id)));
      }).catch(() => {});
    }
  }, [id, user]);

  const addToCart = async () => {
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess(`🛒 Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      showError('Please login to add items to wishlist');
      return;
    }
    try {
      const res = await api.post(`/wishlist/${product.id}`);
      setInWishlist(res.data.inWishlist);
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess(res.data.inWishlist ? '❤️ Added to wishlist' : '💔 Removed from wishlist');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
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

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200', icon: '❌' };
    if (stock < 10) return { text: `Only ${stock} left`, color: 'text-amber-600 bg-amber-50 border-amber-200', icon: '⚠️' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200', icon: '✅' };
  };

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-12 text-center shadow-lg">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h3>
          <p className="text-gray-500 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <>
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} fresh and fast. Free delivery on orders over $50.`}
        image={product.image_url}
        url={`/products/${id}`}
      />
      <div className="container py-8 max-w-5xl mx-auto px-4">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group mb-4">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      {/* Product Detail Card */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-8">
            {product.image_url ? (
              <img 
                loading="lazy" 
                src={product.image_url} 
                alt={product.name} 
                className="w-full max-w-md rounded-xl border-2 border-orange-200 shadow-lg hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full max-w-md aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 flex items-center justify-center shadow-lg">
                <span className="text-8xl">🍽️</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-5">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryEmoji(product.category_name)}</span>
              <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {product.category_name || 'Uncategorized'}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-600">${parseFloat(product.price).toFixed(2)}</span>
              {product.old_price && (
                <span className="text-lg text-gray-400 line-through">${parseFloat(product.old_price).toFixed(2)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${stockStatus.color}`}>
              <span>{stockStatus.icon}</span>
              <span className="text-sm font-semibold">{stockStatus.text}</span>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <span>📝</span> Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 pt-2">
                <label className="text-sm font-semibold text-gray-600">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-xl hover:bg-orange-200 text-orange-600 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold w-10 text-center text-gray-700">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-xl hover:bg-orange-200 text-orange-600 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">Max: {product.stock}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={addToCart} 
                disabled={product.stock <= 0} 
                className={`flex-1 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  product.stock > 0 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? (
                  <>
                    <span>🛒</span> Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
              <button
                onClick={toggleWishlist}
                type="button"
                className={`p-3.5 rounded-xl transition-all duration-200 border-2 ${
                  inWishlist 
                    ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100' 
                    : 'bg-white text-gray-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {inWishlist ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t-2 border-orange-100 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <span>📦</span> SKU: {product.id}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <span>📊</span> {product.stock} in stock
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products / Recommendations */}
      <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 text-center">
        <p className="text-sm text-gray-600">
          🌟 Love this product? Check out more delicious items in our{' '}
          <Link to={`/products?category=${product.category_name?.toLowerCase()}`} className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
            {product.category_name || 'food'} collection
          </Link>
        </p>
        <p className="font-handwritten text-orange-500 text-lg mt-2">
          All handpicked by real food lovers
        </p>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;

 ProductDetail;


