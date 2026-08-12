import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showError } = useAlert();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get(`/orders?page=${page}&limit=20`);
        setOrders(res.data.orders || res.data);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError('Failed to load orders');
        showError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [page, showError]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-red-200 p-12 text-center shadow-lg">
          <span className="text-6xl block mb-4">❌</span>
          <h3 className="text-xl font-bold text-red-600 mb-2">Failed to Load Orders</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
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
            <span className="text-2xl">📋</span>
          </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
               <p className="text-sm text-gray-500">Track and manage your food orders</p>
               <p className="font-handwritten text-orange-500 text-sm">
                 Every order packed with real care
               </p>
             </div>
        </div>
        {orders.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-orange-600">{orders.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-16 text-center shadow-lg">
          <span className="text-8xl block mb-6">📭</span>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-6">You haven't placed any orders. Start exploring delicious food now!</p>
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
        <>
          {/* Card-based Order Display */}
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                to={`/orders/${order.id}`}
                className="block bg-white rounded-2xl border-2 border-orange-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-mono font-bold text-orange-600">#{order.id}</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                        <span>{getStatusEmoji(order.status)}</span>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 truncate" title={order.shipping_address}>
                      📍 {order.shipping_address}
                    </p>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                      <p className="text-lg font-bold text-orange-600">${parseFloat(order.total).toFixed(2)}</p>
                    </div>
                    <div className="text-orange-600 group-hover:translate-x-1 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-orange-100">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          order.status === 'pending' ? 'w-1/4 bg-yellow-500' :
                          order.status === 'processing' ? 'w-1/2 bg-blue-500' :
                          order.status === 'shipped' ? 'w-3/4 bg-purple-500' :
                          order.status === 'delivered' || order.status === 'completed' ? 'w-full bg-green-500' :
                          'w-full bg-red-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {order.status === 'pending' ? 'Order placed' :
                       order.status === 'processing' ? 'Processing' :
                       order.status === 'shipped' ? 'On the way' :
                       order.status === 'delivered' || order.status === 'completed' ? 'Delivered ✓' :
                       'Cancelled'}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <span>🍽️</span>
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    {order.items.slice(0, 2).map((item, idx) => (
                      <React.Fragment key={idx}>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{item.product_name}</span>
                      </React.Fragment>
                    ))}
                    {order.items.length > 2 && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>+{order.items.length - 2} more</span>
                      </>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 items-center bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg mt-6">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
                <span className="text-sm font-medium text-gray-700">Page</span>
                <span className="text-sm font-bold text-orange-600">{page}</span>
                <span className="text-sm text-gray-500">of {totalPages}</span>
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;