import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import api from '../services/api';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get('/admin/notifications');
        setNotifications(res.data.notifications || []);
      } catch (err) {
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-200 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin access required to view this page.</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/admin/pos', label: 'POS Terminal', icon: '🖥️' },
    { path: '/admin/products', label: 'Products', icon: '🍽️' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/users', label: 'Customers', icon: '👥' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-orange-900 to-amber-900 text-white flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-orange-800/50 bg-white/5 backdrop-blur-sm">
          <Link to="/admin" onClick={closeSidebar} className="flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🍽️</span>
            <span className="text-orange-400">Food</span>
            <span className="text-amber-400">Hub</span>
            <span className="text-xs font-medium bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full ml-1">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-orange-400/60 uppercase tracking-wider px-3 mb-4">
            Main Menu
          </div>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.exact ? location.pathname === item.path : isActive(item.path)
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                  : 'text-orange-200/70 hover:bg-white/10 hover:text-white hover:scale-[1.02]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
              {item.path === '/admin/orders' && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  3
                </span>
              )}
            </Link>
          ))}
          
          <div className="mt-6 pt-6 border-t border-orange-800/50">
            <div className="text-xs font-semibold text-orange-400/60 uppercase tracking-wider px-3 mb-4">
              Quick Actions
            </div>
            <Link
              to="/admin/products"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-200/70 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <span className="text-xl">➕</span>
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-orange-200/70 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <span className="text-xl">📦</span>
              Process Orders
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-orange-800/50 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-orange-300/70 truncate">{user.email}</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <Link to="/" onClick={closeSidebar} className="flex-1 text-center text-xs py-2.5 rounded-xl bg-white/10 text-orange-200 hover:bg-white/20 hover:text-white transition-colors">
              🏪 Store
            </Link>
            <button 
              onClick={logout} 
              className="flex-1 text-center text-xs py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b-2 border-orange-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-orange-100 transition-colors text-orange-600"
                aria-label="Open sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="text-sm font-semibold text-gray-700 truncate" id="page-title">
                  {navItems.find(item => item.exact ? location.pathname === item.path : isActive(item.path))?.label || 'Dashboard'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Date & Time */}
              <div className="hidden md:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-orange-500">📅</span>
                  <span className="text-gray-700 font-medium">{currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-500">🕐</span>
                  <span className="text-gray-700 font-mono font-medium">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <span className="text-xl">🔔</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                 {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-orange-200 z-50 overflow-hidden">
                    <div className="p-3 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                      <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                      <p className="text-xs text-gray-500">You have {notifications.length} new notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Loading notifications...</div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className="p-3 border-b border-orange-100 hover:bg-orange-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg">{notification.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800">{notification.text}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-orange-200 bg-gray-50">
                      <button 
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="w-full text-center text-xs text-orange-600 hover:text-orange-700 font-medium py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar - Mobile */}
              <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-orange-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;