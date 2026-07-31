import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Logo from './Logo';
import Footer from './Footer';
import Toast from './ui/Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useAlert();
  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        loadCartCount();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [user]);

  const loadCartCount = async () => {
    try {
      const res = await api.get('/cart');
      const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container flex justify-between items-center h-16">
          <Logo />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-5 items-center absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent border-b md:border-b-0 border-slate-200 p-4 md:p-0`}>
            <Link to="/products" onClick={closeMobileMenu} className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors">Products</Link>
            <Link to="/cart" onClick={(e) => { if (!user) { e.preventDefault(); navigate('/login'); } closeMobileMenu(); }} className="relative text-slate-600 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {user && (
              <>
                <Link to="/account" onClick={closeMobileMenu} className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors">Account</Link>
                <Link to="/orders" onClick={closeMobileMenu} className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors">Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMobileMenu} className="bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">Admin Panel</Link>
                )}
                <span className="text-sm text-slate-500">Hello, {user.name}</span>
                <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Logout</button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" onClick={closeMobileMenu} className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors">Login</Link>
                <Link to="/register" onClick={closeMobileMenu} className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
        <main className="flex-1">
          <Outlet />
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </>
  );
};

export default Navbar;
