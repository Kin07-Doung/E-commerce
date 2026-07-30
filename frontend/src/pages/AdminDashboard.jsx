import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/ui/Alert';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
        setLowStock(res.data.lowStock);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.products}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Categories</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.categories}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-2xl">🏷️</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.orders}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl">📋</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Revenue</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">${stats.revenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-2xl">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-slate-200">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 text-sm">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Order #{order.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">${parseFloat(order.total).toFixed(2)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Low Stock Alert</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {lowStock.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Alert variant="success">All products are well stocked</Alert>
              </div>
            ) : (
              lowStock.map(product => (
                <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{product.category_name || 'Uncategorized'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 border border-red-200 text-red-700">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3.586l-.879.66a1 1 0 001.44 1.44l.879-.66V6z" clipRule="evenodd" />
                      </svg>
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
