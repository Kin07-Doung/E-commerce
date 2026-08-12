import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const { showError } = useAlert();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        showError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();

    const loadCounts = async () => {
      try {
        const wRes = await api.get('/wishlist/count');
        setWishlistCount(wRes.data.count);
      } catch (err) {
        setWishlistCount(0);
      }
      try {
        const oRes = await api.get('/orders?page=1&limit=1');
        setOrdersCount(oRes.data.total || 0);
      } catch (err) {
        setOrdersCount(0);
      }
    };
    loadCounts();
  }, [showError]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container py-20 max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-red-200 p-12 text-center shadow-lg">
          <span className="text-6xl block mb-4">❌</span>
          <h3 className="text-xl font-bold text-red-600 mb-2">Failed to Load Profile</h3>
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

  const links = [
    { 
      to: '/orders', 
      label: 'My Orders', 
      desc: 'View your order history and track deliveries', 
      icon: '📋', 
      count: ordersCount, 
      countLabel: 'orders',
      color: 'from-orange-500 to-amber-500'
    },
    { 
      to: '/wishlist', 
      label: 'My Wishlist', 
      desc: 'View and manage your saved items', 
      icon: '❤️', 
      count: wishlistCount, 
      countLabel: 'items',
      color: 'from-red-500 to-pink-500'
    },
    { 
      to: '/addresses', 
      label: 'My Addresses', 
      desc: 'Manage your shipping and delivery addresses', 
      icon: '📍',
      color: 'from-brand-500 to-amber-500'
    },
    { 
      to: '/settings', 
      label: 'Account Settings', 
      desc: 'Edit personal info and change password', 
      icon: '⚙️',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <>
      <SEO
        title="My Profile"
        description="Manage your FoodHub account, view orders, and update your preferences."
        url="/profile"
      />
      <div className="container py-8 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-200">
            {getInitials(profile.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {profile.name.split(' ')[0]}! 👋</h2>
            <p className="text-sm text-gray-500">Manage your account and preferences</p>
            <p className="font-handwritten text-orange-500 text-base">
              Real person, real account
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">👤 Name</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{profile.name}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">📧 Email</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{profile.email}</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">📱 Phone</p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{profile.phone || 'Not provided'}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">👑 Role</p>
            <p className="text-sm font-semibold text-gray-800 mt-1 capitalize">
              {profile.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">🔐 Sign-in Method</p>
            <p className="text-sm font-semibold text-gray-800 mt-1 capitalize">{profile.provider}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">📅 Member Since</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{new Date(profile.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="group flex items-center gap-4 bg-white rounded-2xl border-2 border-orange-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {link.label}
                </h3>
                {link.count !== undefined && link.count >= 0 && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${link.color} text-white`}>
                    {link.count} {link.countLabel}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{link.desc}</p>
            </div>
            <div className="text-gray-300 group-hover:text-orange-500 transition-colors group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin Quick Access */}
      {profile.role === 'admin' && (
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Admin Dashboard</h3>
                <p className="text-sm text-gray-500">Manage products, orders, users and more</p>
              </div>
            </div>
            <Link to="/admin" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2">
              <span>⚡</span> Go to Admin Panel
            </Link>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">🔒 Secure Account</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="flex items-center gap-1">🛡️ Privacy Protected</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">⭐ Verified Member</span>
        </div>
      </div>
    </>
  );
};

export default Profile;

 Profile;


