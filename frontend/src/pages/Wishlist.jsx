import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

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

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((i) => i.id !== productId));
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess('Removed from wishlist');
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
      showSuccess('Added to cart');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading wishlist…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Unable to load wishlist</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={loadWishlist}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Wishlist"
        description="Your saved favorite items. Add to cart when ready."
        url="/wishlist"
        noIndex
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Wishlist
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {items.length === 0
                  ? 'Your saved items will appear here'
                  : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Save items you like while browsing, then add them to your cart when you’re ready.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  Browse products
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link to={`/products/${product.id}`} className="relative block">
                    <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                      {product.image_url ? (
                        <img
                          loading="lazy"
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <svg
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Stock badge */}
                    {product.stock === 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">
                        Sold out
                      </span>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white">
                        Only {product.stock} left
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      disabled={removingId === product.id}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm backdrop-blur-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {removingId === product.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      )}
                    </button>
                  </Link>

                  <div className="flex flex-1 flex-col p-4">
                    {product.category_name && (
                      <p className="text-xs font-medium text-gray-400">
                        {product.category_name}
                      </p>
                    )}
                    <Link
                      to={`/products/${product.id}`}
                      className="mt-0.5 text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {product.stock > 0 ? 'In stock' : 'Out of stock'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0 || addingToCart === product.id}
                      className="mt-4 w-full rounded-lg bg-orange-600 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {addingToCart === product.id ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Adding…
                        </span>
                      ) : product.stock > 0 ? (
                        'Add to cart'
                      ) : (
                        'Out of stock'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;