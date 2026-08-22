import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
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
      } catch {
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    };
    loadNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Access denied</h2>
          <p className="mt-2 text-sm text-gray-500">
            Admin access is required to view this page.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Return to store
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/pos', label: 'POS' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/users', label: 'Customers' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const currentPageLabel =
    navItems.find((item) =>
      item.exact ? location.pathname === item.path : isActive(item.path)
    )?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-gray-100 px-5">
          <Link
            to="/admin"
            onClick={closeSidebar}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-600 text-xs font-bold text-white">
              KS
            </span>
            Kin Shop
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.path
              : isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <p className="mb-2 mt-6 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Quick actions
          </p>
          <Link
            to="/admin/products"
            onClick={closeSidebar}
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Add product
          </Link>
          <Link
            to="/admin/orders"
            onClick={closeSidebar}
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Process orders
          </Link>
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex-1 rounded-lg border border-gray-200 py-1.5 text-center text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                aria-label="Open sidebar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-sm font-semibold text-gray-900">
                {currentPageLabel}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        Notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        {notifications.length} unread
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notificationsLoading ? (
                        <p className="p-4 text-center text-sm text-gray-500">
                          Loading…
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-500">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="border-b border-gray-50 px-4 py-3 hover:bg-gray-50"
                          >
                            <p className="text-sm text-gray-800">{n.text}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="w-full rounded-lg py-1.5 text-center text-xs font-medium text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile avatar */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700 md:hidden">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;