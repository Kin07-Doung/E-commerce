import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';

const AdminPOS = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);

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
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">POS Terminal</h1>
          <p className="text-sm text-slate-500 mt-1">Process sales and manage transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Cart Total</p>
            <p className="text-2xl font-bold text-slate-800">${cartTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Items</p>
            <p className="text-2xl font-bold text-slate-800">{cartCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button key="cat-all" variant={selectedCategory ? 'outline' : 'primary'} size="sm" onClick={() => setSelectedCategory(null)}>All</Button>
                {categories.map(cat => (
                  <Button key={`cat-${cat.id}`} variant={selectedCategory === cat.id ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.id)}>
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  {product.image_url && (
                    <img loading="lazy" src={product.image_url} alt={product.name} className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{product.category_name || 'Uncategorized'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
                      <span className="text-xs text-slate-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Current Order</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.product_id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">${parseFloat(item.price).toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded text-slate-600 hover:bg-slate-100" onClick={() => updateQuantity(item.product_id, -1)}>-</Button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="rounded text-slate-600 hover:bg-slate-100" onClick={() => updateQuantity(item.product_id, 1)}>+</Button>
                        <Button variant="ghost" className="ml-2 text-red-600 hover:text-red-700 hover:bg-transparent" onClick={() => removeFromCart(item.product_id)}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-800">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax (0%)</span>
                  <span className="font-medium text-slate-800">$0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-slate-800">Total</span>
                  <span className="text-slate-800">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4"
                disabled={cart.length === 0 || processing}
                onClick={handleCheckout}
              >
                {processing ? 'Processing...' : `Complete Sale (${cartCount} items)`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPOS;


