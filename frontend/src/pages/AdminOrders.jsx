import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useAlert();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders/all?page=${page}&limit=20${filterStatus !== 'all' ? `&status=${filterStatus}` : ''}`);
      setOrders(res.data.orders || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
      showSuccess(`✅ Order #${id} status updated to ${status}`);
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔄' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🚚' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '🎉' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: '❌' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  const getPaymentIcon = (method) => {
    const methods = {
      cash: '💵',
      card: '💳',
      paypal: '💳',
      stripe: '💳',
      bank: '🏦'
    };
    return methods[method?.toLowerCase()] || '💳';
  };

  const filteredOrders = orders.filter(order => 
    searchTerm === '' || 
    order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-orange-600 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="All Orders"
        description="Admin dashboard for managing and tracking customer orders."
        url="/admin/orders"
        noIndex
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
            <p className="text-sm text-gray-500">Manage and track customer orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-3 py-1.5">
            <span className="text-sm">📦</span>
            <span className="text-sm font-semibold text-gray-700">{orders.length}</span>
            <span className="text-xs text-gray-500">orders</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search orders by ID or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
          >
            <option value="all">📊 All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="processing">🔄 Processing</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">✅ Delivered</option>
            <option value="completed">🎉 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-orange-50/50 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 20 + index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-semibold text-orange-600">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{order.user?.name || 'Guest'}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[150px]">{order.shipping_address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-sm text-gray-600 capitalize">
                      <span>{getPaymentIcon(order.payment_method)}</span>
                      {order.payment_method || 'cash'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <span>🍽️</span>
                      {order.items?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-orange-600">${parseFloat(order.total).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="w-full text-sm border-2 border-orange-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="processing">🔄 Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">✅ Delivered</option>
                      <option value="completed">🎉 Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-6xl">📭</span>
                      <p className="text-gray-500 font-medium">No orders found</p>
                      <p className="text-sm text-gray-400">{searchTerm ? 'Try adjusting your search' : 'Orders will appear here when customers place them'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg">
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
      </div>
    </>
  );
};

export default AdminOrders;
