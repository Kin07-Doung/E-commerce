import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    api.get('/products').then(res => {
      const data = res.data;
      setProducts(data.products || data);
    }).catch(() => {});
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const featured = products.slice(0, 8);
  const filtered = selectedCategory ? products.filter(p => p.category_id === selectedCategory) : featured;

  return (
    <div>
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container py-20 px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Discover Amazing Products</h1>
            <p className="text-lg text-blue-100 mb-8">Shop the latest trends with fast delivery and secure checkout. Quality products at unbeatable prices.</p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">Shop Now</Link>
              <Link to="/products" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">View Deals</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg className="relative block w-full h-12 text-slate-50" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.15,256.39,54.39,289.34,63.37,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Featured Products</h2>
            <p className="text-slate-500 mt-1">Handpicked products just for you</p>
          </div>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">View all products →</Link>
        </div>
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!selectedCategory ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No products found in this category</p>
            <button onClick={() => setSelectedCategory(null)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">View all products</button>
          </div>
        )}
      </section>

      <section className="bg-slate-100 py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Shop With Us?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We offer the best shopping experience with top-notch customer service and quality products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🚚</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Free Shipping</h3>
              <p className="text-sm text-slate-500">On all orders over $50. Fast and reliable delivery to your doorstep.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Payment</h3>
              <p className="text-sm text-slate-500">Your payment information is safe with our encrypted checkout system.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💬</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-500">Our customer support team is here to help you anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of happy customers and discover why ShopHub is the best place to shop online.</p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block">Browse Products</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
