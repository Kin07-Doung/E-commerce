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
    } catch (err) {
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
    } catch (err) {
      showError('Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('🗑️ Item removed from cart');
    } catch (err) {
      showError('Failed to remove item');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-12 shadow-lg">
          <span className="text-6xl block mb-4">🔒</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Login Required</h3>
          <p className="text-gray-500 mb-6">Please login to view your cart and place orders.</p>
          <Link to="/login" className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Your Cart"
        description="Review your items and proceed to checkout. Fresh food delivery with free shipping on orders over $50."
        url="/cart"
      />
      <div className="container py-8 space-y-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🛒</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <p className="text-sm text-gray-500">{itemCount} items in your cart</p>
            <p className="font-handwritten text-orange-500 text-sm">
              Real food, handpicked for you
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Total Items</p>
            <p className="text-xl font-bold text-orange-600">{itemCount}</p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-16 text-center shadow-lg">
          <span className="text-8xl block mb-6">🛒</span>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any food items to your cart yet.</p>
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="xl:col-span-2 overflow-x-auto">
            <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-orange-50/50 transition-colors duration-150 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {item.image_url ? (
                            <img loading="lazy" src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover border-2 border-orange-200" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-2 border-orange-200">
                              <span className="text-2xl">🍽️</span>
                            </div>
                          )}
                          <div>
                            <Link to={`/products/${item.product_id}`} className="text-sm font-semibold text-gray-800 hover:text-orange-600 transition-colors">
                              {item.name}
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">{item.category_name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-600">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-xl hover:bg-orange-200 text-orange-600 transition-colors font-bold"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-gray-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-xl hover:bg-orange-200 text-orange-600 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span> Order Summary
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-700">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (0%)</span>
                  <span className="font-medium text-gray-700">$0.00</span>
                </div>
                <div className="border-t-2 border-orange-200 pt-3 flex justify-between">
                  <span className="text-base font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🛒</span> Proceed to Checkout
              </button>
                <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-orange-600 transition-colors">
                  ← Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t-2 border-orange-100">
                <div className="flex justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">🔒 Secure Checkout</span>
                  <span className="flex items-center gap-1">🚚 Free Delivery</span>
                  <span className="flex items-center gap-1">⭐ Fresh Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Cart;