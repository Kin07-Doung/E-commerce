import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useAlert } from '../context/AlertContext';

const AdminPOS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/categories')
    ]);
    setProducts(productsRes.data.products || productsRes.data);
    setCategories(categoriesRes.data.categories || categoriesRes.data);
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && p.stock > 0;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, product_id: product.id, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.product_id === productId);
      const product = products.find(p => p.id === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter(i => i.product_id !== productId);
      if (product && newQty > product.stock) return prev;
      return prev.map(i => i.product_id === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product_id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: customerName || 'Walk-in Customer',
        payment_method: paymentMethod,
        total: cartTotal
      };

      await api.post('/admin/pos/checkout', orderData);
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      loadData();
      showSuccess('✅ Order placed successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  const getCategoryEmoji = (categoryName) => {
    const emojis = {
      'bakery': '🍞',
      'dairy': '🥛',
      'meat': '🥩',
      'seafood': '🐟',
      'fruits': '🍎',
      'vegetables': '🥬',
      'organic': '🌿',
      'fresh': '✨',
      'seasonal': '🍂'
    };
    if (!categoryName) return '🏷️';
    const lowerName = categoryName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '🏷️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🖥️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">POS Terminal</h1>
            <p className="text-sm text-gray-500">Process sales and manage transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Cart Total</p>
            <p className="text-2xl font-bold text-orange-600">${cartTotal.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-2xl font-bold text-orange-600">{cartCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="xl:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
                />
                <svg className="w-4 h-4 text-orange-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button 
                  key="cat-all" 
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    !selectedCategory 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100 border-2 border-orange-200'
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  🍽️ All
                </button>
                {categories.map(cat => (
                  <button 
                    key={`cat-${cat.id}`} 
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat.id 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                        : 'bg-orange-50 text-gray-600 hover:bg-orange-100 border-2 border-orange-200'
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {getCategoryEmoji(cat.name)} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="group bg-white rounded-2xl border-2 border-orange-200 p-4 text-left hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-3">
                  {product.image_url ? (
                    <img loading="lazy" src={product.image_url} alt={product.name} className="w-full h-32 rounded-xl object-cover border border-orange-100 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border border-orange-200">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                        {product.name}
                      </h3>
                      <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                        {getCategoryEmoji(product.category_name)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{product.category_name || 'Uncategorized'}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-orange-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-orange-600">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <span className={`text-xs font-medium ${product.stock > 5 ? 'text-green-600' : 'text-amber-600'}`}>
                        {product.stock > 5 ? '✓ In stock' : `⚠️ Only ${product.stock} left`}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg sticky top-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-orange-100">
              <span className="text-2xl">🛒</span>
              <h3 className="text-lg font-bold text-gray-800">Current Order</h3>
              {cartCount > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartCount} items
                </span>
              )}
            </div>

            {/* Customer & Payment */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                  <span>👤</span> Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full px-3 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                  <span>💳</span> Payment Method
                </label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="mobile">📱 Mobile Payment</option>
                </select>
              </div>
            </div>

            {/* Cart Items */}
            <div className="border-t-2 border-orange-100 pt-4">
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <span className="text-5xl mb-2">🛒</span>
                    <p className="text-sm text-gray-500">Cart is empty</p>
                    <p className="text-xs text-gray-400">Add items from the menu</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product_id} className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-xl border border-orange-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-orange-600 font-semibold">${parseFloat(item.price).toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          className="w-7 h-7 rounded-lg bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center"
                          onClick={() => updateQuantity(item.product_id, -1)}
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold w-6 text-center text-gray-700">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 rounded-lg bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center"
                          onClick={() => updateQuantity(item.product_id, 1)}
                        >
                          +
                        </button>
                        <button 
                          className="w-7 h-7 rounded-lg bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300 transition-colors flex items-center justify-center ml-1"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-orange-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-700">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (0%)</span>
                  <span className="font-medium text-gray-700">$0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-orange-100">
                  <span className="text-gray-800">Total</span>
                  <span className="text-orange-600 text-xl">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className={`w-full mt-4 py-3 rounded-xl text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  cart.length === 0 || processing
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg active:scale-95'
                }`}
                disabled={cart.length === 0 || processing}
                onClick={handleCheckout}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    💳 Complete Sale ({cartCount} items)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPOS;