import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data.products || productsRes.data);
        setCategories(categoriesRes.data.categories || categoriesRes.data);
        
        if (user) {
          const wishlistRes = await api.get('/wishlist');
          const ids = new Set((wishlistRes.data || []).map(p => p.id));
          setWishlistIds(ids);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('🛒 Added to cart!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const res = await api.post(`/wishlist/${product.id}`);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (res.data.inWishlist) {
          next.add(product.id);
        } else {
          next.delete(product.id);
        }
        return next;
      });
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess(res.data.inWishlist ? '❤️ Added to wishlist' : '💔 Removed from wishlist');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const featured = products.slice(0, 8);
  const filtered = selectedCategory ? products.filter(p => p.category_id === selectedCategory) : featured;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading delicious food...</p>
          <div className="flex gap-2 text-2xl">
            <span className="animate-bounce delay-0">🍕</span>
            <span className="animate-bounce delay-150">🍔</span>
            <span className="animate-bounce delay-300">🌮</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Home"
        description="Discover fresh, quality ingredients and mouth-watering meals. Order now and enjoy the best culinary experience at home with free delivery on orders over $50."
        url="/"
      />
      <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">🍕</div>
          <div className="absolute bottom-20 right-20 text-8xl animate-float-delayed">🍔</div>
          <div className="absolute top-1/2 left-1/2 text-8xl animate-float-slow">🌮</div>
          <div className="absolute bottom-40 left-1/4 text-6xl animate-float">🍣</div>
          <div className="absolute top-20 right-1/4 text-7xl animate-float-delayed">🥗</div>
        </div>
        <div className="container relative py-24 px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                🍽️ Fresh Food Delivery
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Delicious Food
              <span className="block text-amber-200">Delivered to Your Door</span>
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Discover fresh, quality ingredients and mouth-watering meals. 
              Order now and enjoy the best culinary experience at home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2">
                <span>🍽️</span> Order Now
              </Link>
              <Link to="/products?category=fresh" className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center gap-2">
                <span>✨</span> Fresh Deals
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg className="relative block w-full h-16 text-white" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.15,256.39,54.39,289.34,63.37,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span>🔥</span> Featured Food
            </h2>
            <p className="text-gray-500 mt-1">Handpicked delicious items just for you</p>
          </div>
          <Link to="/products" className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 group">
            View all products 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button 
            onClick={() => setSelectedCategory(null)} 
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md' 
                : 'bg-white border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
            }`}
          >
            🍽️ All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                selectedCategory === cat.id 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md' 
                  : 'bg-white border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              {getCategoryEmoji(cat.name)} {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
              wishlistIds={wishlistIds} 
              onToggleWishlist={toggleWishlist} 
            />
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-orange-200">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No products found in this category</p>
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
            >
              View all products → 
            </button>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <span className="text-4xl block mb-3">⭐</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose FoodHub?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We bring the best of culinary world to your doorstep with quality, freshness, and care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border-2 border-orange-200 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                🚚
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Free Delivery</h3>
              <p className="text-sm text-gray-500">Free delivery on all orders over $50. Fast and reliable service to your doorstep.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-orange-200 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                🔒
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-500">Your payment information is safe with our encrypted and secure checkout system.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-orange-200 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
                💬
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500">Our dedicated support team is here to help you anytime, anywhere, every day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 py-16">
        <div className="container text-center px-4">
          <div className="flex justify-center gap-2 text-5xl mb-4">
            <span className="animate-bounce delay-0">🍕</span>
            <span className="animate-bounce delay-100">🍔</span>
            <span className="animate-bounce delay-200">🌮</span>
            <span className="animate-bounce delay-300">🍣</span>
            <span className="animate-bounce delay-400">🥗</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and discover why FoodHub is the best place 
            for fresh, delicious food delivery — made by humans, for humans.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center gap-2">
              <span>🍽️</span> Browse Menu
            </Link>
            <Link to="/register" className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-2">
              <span>👤</span> Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story - Human Made Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 paper-texture">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="font-handwritten text-6xl text-orange-600 block animate-wobble">
                Our Story
              </span>
            </div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              We're not a robot factory. We're a team of real food lovers who believe that 
              the best meals come from real hands, real ingredients, and real care.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every product on FoodHub is carefully selected by people who actually taste, 
              test, and treasure good food. No algorithms decide what's fresh — we do.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="stamp stamp-orange">Real People</span>
              <span className="stamp stamp-orange">Real Food</span>
              <span className="stamp stamp-orange">Real Love</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;