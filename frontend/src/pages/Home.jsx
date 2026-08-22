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
          api.get('/categories'),
        ]);
        setProducts(productsRes.data.products || productsRes.data);
        setCategories(categoriesRes.data.categories || categoriesRes.data);

        if (user) {
          const wishlistRes = await api.get('/wishlist');
          const ids = new Set((wishlistRes.data || []).map((p) => p.id));
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
      showSuccess('Added to cart');
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
      showSuccess(
        res.data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist'
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const featured = products.slice(0, 8);
  const filtered = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : featured;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading products…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Home"
        description="Discover fresh, quality ingredients and meals. Free delivery on orders over $50."
        url="/"
      />

      <div className="bg-gray-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-amber-700/90" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide text-orange-100">
                Fresh food delivery
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Quality ingredients, delivered to your door
              </h1>
              <p className="mt-4 text-lg text-orange-50/90 leading-relaxed">
                Shop fresh produce, pantry staples, and ready-to-cook meals.
                Free delivery on orders over $50.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-orange-50 transition-colors"
                >
                  Shop now
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Browse categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Featured products
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Handpicked items for you
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
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
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-900">
                No products in this category
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View all products
              </button>
            </div>
          )}
        </section>

        {/* Value props */}
        <section className="border-t border-gray-200 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Why shop with us
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                Quality, convenience, and care in every order
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Free delivery',
                  description:
                    'Free delivery on all orders over $50. Fast and reliable to your door.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Secure payment',
                  description:
                    'Your payment information is protected with industry-standard encryption.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                },
                {
                  title: '24/7 support',
                  description:
                    'Our support team is available anytime to help with your orders.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 py-14">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Ready to order?
            </h2>
            <p className="mt-3 text-sm text-gray-300 max-w-lg mx-auto">
              Browse our full selection of fresh ingredients and meals, or create
              an account for faster checkout.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Browse products
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;