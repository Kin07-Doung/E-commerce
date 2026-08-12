import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';

const OrderDetail = () => {
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

  const getPaymentMethodIcon = (method) => {
    const methods = {
      'cash': '💵',
      'card': '💳',
      'paypal': '💳',
      'stripe': '💳',
      'mobile': '📱',
      'bank': '🏦'
    };
    return methods[method?.toLowerCase()] || '💳';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <Link to="/orders" className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      {/* Back Button */}
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group mb-4">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      {/* Order Detail Card */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b-2 border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <span className="text-2xl">📋</span>
              </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                 <p className="text-sm text-gray-500">
                   {formatDate(order.created_at)} at {formatTime(order.created_at)}
                 </p>
                 <p className="font-handwritten text-orange-500 text-sm">
                   Prepared by real humans
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getStatusEmoji(order.status)}</span>
              <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-lg font-bold text-orange-600">${parseFloat(order.total).toFixed(2)}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <span>{getPaymentMethodIcon(order.payment_method)}</span>
                {order.payment_method || 'Cash'}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm font-semibold text-gray-700">{order.items?.length || 0} products</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-semibold text-gray-700">{formatDate(order.created_at)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <span>🍽️</span> Order Items
              <span className="text-xs font-normal text-gray-400">({order.items?.length || 0})</span>
            </h3>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    {item.product_image ? (
                      <img loading="lazy" src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-xl object-cover border-2 border-orange-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-2 border-orange-200">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
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

          {/* Order Timeline */}
          <div className="p-4 bg-white rounded-xl border-2 border-orange-200">
            <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
              <span>⏱️</span> Order Timeline
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Order Placed</p>
                  <p className="text-xs text-gray-400">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                </div>
                <span className="text-xs text-green-600 font-medium">✅</span>
              </div>
              {order.status !== 'pending' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Order Processed</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">🔄</span>
                </div>
              )}
              {order.status === 'shipped' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Order Shipped</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">🚚</span>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Delivered</p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)} at {formatTime(order.created_at)}</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">✅</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-orange-200">
            <Link to="/orders" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-center flex items-center justify-center gap-2">
              <span>📋</span> View All Orders
            </Link>
            {order.status !== 'delivered' && order.status !== 'completed' && order.status !== 'cancelled' && (
              <button className="flex-1 bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 text-center flex items-center justify-center gap-2">
                <span>💬</span> Contact Support
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;