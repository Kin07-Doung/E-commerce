import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/orders?page=1&limit=1');
        setStats({ totalOrders: res.data.total || 0 });
      } catch (err) {
        setStats({ totalOrders: 0 });
      } finally {
        setLoading(false);
      }
    };
    if (user) loadStats();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p className="text-slate-500 mb-4">Please login to view your account.</p>
        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Login</Link>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-blue-100">Manage your profile and orders</p>
        </div>
      </div>

      <div className="container space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mx-auto mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                {user.role || 'Customer'}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-sm font-medium text-slate-800">{user.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-sm font-medium text-slate-800">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-sm font-medium text-slate-800">{loading ? '...' : stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Link to="/orders" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">My Orders</h4>
                    <p className="text-sm text-slate-500">View order history</p>
                  </div>
                </div>
              </Link>
              <Link to="/cart" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">My Cart</h4>
                    <p className="text-sm text-slate-500">Continue shopping</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
