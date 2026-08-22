import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

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
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories'),
      ]);
      setProducts(productsRes.data.products || productsRes.data);
      setCategories(categoriesRes.data.categories || categoriesRes.data);
    } catch {
      showError('Failed to load products');
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && p.stock > 0;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, product_id: product.id, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product_id === productId);
      const product = products.find((p) => p.id === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.product_id !== productId);
      if (product && newQty > product.stock) return prev;
      return prev.map((i) =>
        i.product_id === productId ? { ...i, quantity: newQty } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: customerName || 'Walk-in Customer',
        payment_method: paymentMethod,
        total: cartTotal,
      };

      await api.post('/admin/pos/checkout', orderData);
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      loadData();
      showSuccess('Order placed successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <SEO
        title="POS Terminal"
        description="Admin POS terminal for processing sales and managing transactions."
        url="/admin/pos"
        noIndex
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Point of sale
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Process in-store sales and walk-in orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-lg font-semibold text-gray-900">{cartCount}</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-semibold text-orange-600">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Products */}
          <div className="xl:col-span-2 space-y-4">
            {/* Search & category filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:border-orange-300 hover:shadow-md"
                >
                  {product.image_url ? (
                    <img
                      loading="lazy"
                      src={product.image_url}
                      alt={product.name}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg bg-gray-100">
                      <svg
                        className="h-8 w-8 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="mt-3 flex flex-1 flex-col">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-700">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {product.category_name || 'Uncategorized'}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-sm font-semibold text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {product.stock > 5
                          ? 'In stock'
                          : `${product.stock} left`}
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm font-medium text-gray-900">
                    No products found
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cart panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-4 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Current order
                  </h2>
                  {cartCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 p-4">
                {/* Customer & payment */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Customer name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Walk-in Customer"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Payment method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile">Mobile payment</option>
                    </select>
                  </div>
                </div>

                {/* Cart items */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="max-h-56 space-y-2 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">Cart is empty</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          Select products to add them
                        </p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${parseFloat(item.price).toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product_id, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product_id)}
                              className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Totals */}
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-medium text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={cart.length === 0 || processing}
                    onClick={handleCheckout}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {processing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing…
                      </>
                    ) : (
                      `Complete sale · ${cartCount} ${
                        cartCount === 1 ? 'item' : 'items'
                      }`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPOS;