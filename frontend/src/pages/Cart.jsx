import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } catch {
      showError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity });
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      showError('Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('Item removed from cart');
    } catch {
      showError('Failed to remove item');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Sign in to view your cart</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to access your cart and place orders.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading cart…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Your Cart"
        description="Review your items and proceed to checkout."
        url="/cart"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Shopping cart
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {itemCount === 0
                ? 'Your cart is empty'
                : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your cart is empty</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Looks like you haven’t added anything yet. Browse our products to get started.
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <ul className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          {item.image_url ? (
                            <img
                              loading="lazy"
                              src={item.image_url}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                to={`/products/${item.product_id}`}
                                className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {item.category_name || 'Uncategorized'}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>

                  <dl className="mt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Subtotal</dt>
                      <dd className="font-medium text-gray-900">${total.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Delivery</dt>
                      <dd className="font-medium text-emerald-600">Free</dd>
                    </div>
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Tax</dt>
                      <dd className="font-medium text-gray-900">$0.00</dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold">
                      <dt className="text-gray-900">Total</dt>
                      <dd className="text-orange-600">${total.toFixed(2)}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="mt-5 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                  >
                    Proceed to checkout
                  </button>

                  <Link
                    to="/products"
                    className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    Continue shopping
                  </Link>

                  <p className="mt-5 text-center text-xs text-gray-400">
                    Secure checkout · Free delivery · Fresh guarantee
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;