import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useAlert();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        showError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, showError]);

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-20 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-12 text-center shadow-lg">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-500 mb-6">We couldn't find your order. Please try again.</p>
          <Link to="/products" className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const getStatusEmoji = (status) => {
    const statusMap = {
      'pending': '⏳',
      'processing': '🔄',
      'shipped': '🚚',
      'delivered': '✅',
      'completed': '🎉',
      'cancelled': '❌'
    };
    return statusMap[status?.toLowerCase()] || '📦';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return colorMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title="Order Confirmed"
        description={`Thank you for your order #${order.id}! Your fresh food is being packed with care.`}
        url={`/order-confirmation/${id}`}
      />
      <div className="container py-8 max-w-2xl mx-auto px-4">
      {/* Confirmation Card */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b-2 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-3xl shadow-md">
              ✅
            </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
               <p className="text-sm text-gray-500">Thank you for your order</p>
               <p className="font-handwritten text-orange-500 text-base">
                 We'll pack this with extra love
               </p>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-mono font-bold text-orange-600">#{order.id}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span>{getStatusEmoji(order.status)}</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 text-center">
            <p className="text-xs text-gray-500">Order Total</p>
            <p className="text-3xl font-bold text-orange-600">${parseFloat(order.total).toFixed(2)}</p>
          </div>

          {/* Delivery Info */}
          <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Estimated Delivery</p>
                <p className="text-sm text-gray-600">{getEstimatedDelivery()}</p>
                <p className="text-xs text-gray-400 mt-1">Free delivery on this order</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="p-4 bg-white rounded-xl border-2 border-orange-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <span>📍</span> Shipping Address
              </p>
              <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">
                {order.shipping_address}
              </pre>
            </div>
          )}

          {/* Order Items Preview */}
          {order.items && order.items.length > 0 && (
            <div className="p-4 bg-white rounded-xl border-2 border-orange-200">
              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                <span>🍽️</span> Order Items ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-1 border-b border-orange-100 last:border-0">
                    <span className="text-gray-700">{item.product_name || `Item ${index + 1}`}</span>
                    <span className="font-semibold text-gray-800">${parseFloat(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    + {order.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-orange-200">
            <Link to="/products" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-center flex items-center justify-center gap-2">
              <span>🍽️</span> Continue Shopping
            </Link>
            <Link to="/orders" className="flex-1 bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 text-center flex items-center justify-center gap-2">
              <span>📋</span> View All Orders
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t-2 border-orange-100 text-xs text-gray-400">
            <span className="flex items-center gap-1">🔒 Secure Payment</span>
            <span className="flex items-center gap-1">🚚 Free Delivery</span>
            <span className="flex items-center gap-1">⭐ Fresh Guarantee</span>
            <span className="flex items-center gap-1">💬 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-orange-50 rounded-xl border-2 border-orange-200 text-center">
        <p className="text-sm text-gray-600">
          Need help with your order? 
          <Link to="/contact" className="text-orange-600 font-medium hover:text-orange-700 ml-1">
            Contact Support →
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default OrderConfirmation;