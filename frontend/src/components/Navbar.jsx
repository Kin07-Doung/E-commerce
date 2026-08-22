import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Footer from './Footer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      loadCartCount();
      loadWishlistCount();
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        loadCartCount();
      }
    };
    const handleWishlistUpdate = () => {
      if (user) {
        loadWishlistCount();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [user]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories((res.data.categories || res.data).slice(0, 6));
      } catch (err) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const loadCartCount = async () => {
    try {
      const res = await api.get('/cart');
      const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  };

  const loadWishlistCount = async () => {
    try {
      const res = await api.get('/wishlist/count');
      setWishlistCount(res.data.count);
    } catch (err) {
      setWishlistCount(0);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const closeCategories = () => setShowCategories(false);

  const categoriesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b-2 border-orange-200 sticky top-0 z-50 shadow-md">
        {/* Top Bar - Delivery info */}
        <div className="hidden md:block bg-orange-600 text-white text-xs py-1">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Free delivery on orders over $50
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                24/7 Customer Support
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>⭐ Fresh Ingredients Guaranteed</span>
            </div>
          </div>
        </div>

         {/* Main Navbar */}
         <div className="container flex justify-between items-center h-20">
             {/* Logo */}
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold group">
                <span className="text-3xl group-hover:animate-wobble transition-transform">🛒</span>
                <div className="flex flex-col leading-none">
                  <span className="text-orange-600">Kin</span>
                  <span className="text-amber-600 -mt-1">Shop</span>
                </div>
                <span className="hidden sm:inline-block ml-2 font-handwritten text-orange-500 text-base font-medium animate-pulse">
                  Your e-order destination
                </span>
              </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for fresh food, recipes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-full border-2 border-orange-200 focus:border-orange-500 focus:outline-none bg-white/80 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              onClick={(e) => { if (!user) { e.preventDefault(); navigate('/login'); } }}
              className="relative p-2.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist - Fixed Heart Icon */}
            <Link
              to="/wishlist"
              onClick={(e) => { if (!user) { e.preventDefault(); navigate('/login'); } }}
              className="relative p-2.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              {user && wishlistCount > 0 ? (
                <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              )}
              {user && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
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
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <div className="hidden md:block border-t border-orange-200 bg-white/50 backdrop-blur-sm">
          <div className="container">
            <div className="flex items-center gap-1 py-2">
              <div className="relative" ref={categoriesRef}>
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  className="px-4 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  All Categories
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategories && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-orange-100 py-2 z-50"
                    onClick={closeCategories}
                  >
                    {categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.name.toLowerCase()}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-sm"
                        onClick={() => { closeCategories(); closeMobileMenu(); }}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-gray-700">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/products" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                All Products
              </Link>
              <Link to="/products?category=fresh" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                Fresh Deals
              </Link>
              <Link to="/products?category=organic" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                Organic
              </Link>
              <Link to="/products?category=seasonal" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                Seasonal
              </Link>
              {user && (
                <>
                  <Link to="/orders" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    My Orders
                  </Link>
                  <Link to="/profile" className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    Profile
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="ml-auto px-4 py-1.5 bg-orange-600 text-white text-sm rounded-lg font-medium hover:bg-orange-700 transition-colors">
                  Admin Panel
                </Link>
              )}
              {!user ? (
                <div className="ml-auto flex items-center gap-2">
                  <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-1.5 bg-orange-600 text-white text-sm rounded-lg font-medium hover:bg-orange-700 transition-colors">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-sm text-gray-600">👋 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col bg-white border-t border-orange-200 shadow-lg`}>
          {/* Mobile Search */}
          <div className="p-4 border-b border-orange-100">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border-2 border-orange-200 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile Categories */}
          <div className="p-4 border-b border-orange-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(0, 6).map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  onClick={closeMobileMenu}
                  className="flex flex-col items-center p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs text-gray-600 mt-1">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Links */}
          <div className="p-4 space-y-3">
            <Link to="/products" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
              All Products
            </Link>
            <Link to="/products?category=fresh" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
              Fresh Deals
            </Link>
            <Link to="/products?category=organic" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
              Organic
            </Link>
            <Link to="/products?category=seasonal" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
              Seasonal
            </Link>
            {user && (
              <>
                <Link to="/orders" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
                  My Orders
                </Link>
                <Link to="/profile" onClick={closeMobileMenu} className="block text-gray-700 hover:text-orange-600 transition-colors">
                  Profile
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={closeMobileMenu} className="block bg-orange-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:bg-orange-700 transition-colors">
                Admin Panel
              </Link>
            )}
            {!user ? (
              <div className="flex gap-3 pt-2 border-t border-orange-100">
                <Link to="/login" onClick={closeMobileMenu} className="flex-1 text-center px-4 py-2 border border-orange-300 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                  Login
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="flex-1 text-center px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-orange-100">
                <p className="text-sm text-gray-600 mb-2">👋 Hello, {user.name}</p>
                <button
                  onClick={() => { handleLogout(); closeMobileMenu(); }}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Navbar;