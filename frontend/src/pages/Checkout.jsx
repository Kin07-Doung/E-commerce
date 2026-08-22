import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const formatAddress = (a) => {
  if (!a) return '';
  const parts = [
    a.name,
    a.address_line1,
    a.address_line2,
    [a.city, a.state].filter(Boolean).join(', '),
    a.postal_code,
    a.country,
    a.phone && `Phone: ${a.phone}`,
  ];
  return parts.filter(Boolean).join('\n');
};

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadAddresses = async () => {
      setAddrLoading(true);
      try {
        const res = await api.get('/user/addresses');
        setAddresses(res.data);
        const def = res.data.find((a) => a.is_default) || res.data[0];
        if (def) {
          setSelectedAddress(String(def.id));
        } else {
          setSelectedAddress('manual');
        }
      } catch {
        setAddresses([]);
        setSelectedAddress('manual');
      } finally {
        setAddrLoading(false);
      }
    };

    const loadCart = async () => {
      setCartLoading(true);
      try {
        const res = await api.get('/cart');
        setCart(res.data || []);
      } catch {
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    loadAddresses();
    loadCart();
  }, [user, navigate]);

  const selectedAddrObj = addresses.find((a) => String(a.id) === selectedAddress);
  const showManual = selectedAddress === 'manual';

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let shipping_address;
      if (selectedAddrObj) {
        shipping_address = formatAddress(selectedAddrObj);
      } else {
        shipping_address = address;
      }
      if (!shipping_address.trim()) {
        showError('Please provide a shipping address');
        setSubmitting(false);
        return;
      }
      const res = await api.post('/orders', { shipping_address });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('Order placed successfully');
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (addrLoading || cartLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading checkout…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your order securely. Choose your delivery address."
        url="/checkout"
        noIndex
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Choose a delivery address and place your order
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Delivery address
                  </h2>

                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                          selectedAddress === String(addr.id)
                            ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={String(addr.id)}
                          checked={selectedAddress === String(addr.id)}
                          onChange={() => setSelectedAddress(String(addr.id))}
                          className="mt-1 h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {addr.name}
                            </span>
                            {addr.is_default && (
                              <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                                Default
                              </span>
                            )}
                            {addr.label && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                {addr.label}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                            {formatAddress(addr)}
                          </p>
                        </div>
                      </label>
                    ))}

                    {/* Manual option */}
                    <label
                      className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                        showManual
                          ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value="manual"
                        checked={showManual}
                        onChange={() => setSelectedAddress('manual')}
                        className="mt-1 h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Enter a different address
                      </span>
                    </label>
                  </div>

                  {(showManual || addresses.length === 0) && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-xs font-medium text-gray-500">
                        Full shipping address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required={!selectedAddrObj}
                        placeholder={`Name\nStreet address\nCity, State ZIP\nCountry\nPhone`}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y min-h-[120px]"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || cartCount === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Placing order…
                    </>
                  ) : (
                    'Place order'
                  )}
                </button>
              </form>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900">
                  Order summary
                </h2>

                {cart.length > 0 && (
                  <ul className="mt-4 max-h-48 space-y-3 overflow-y-auto border-b border-gray-100 pb-4">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2 text-sm">
                        <span className="min-w-0 truncate text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="shrink-0 font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Items</dt>
                    <dd className="font-medium text-gray-900">{cartCount}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="font-medium text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Delivery</dt>
                    <dd className="font-medium text-emerald-600">Free</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Tax</dt>
                    <dd className="font-medium text-gray-900">$0.00</dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold">
                    <dt className="text-gray-900">Total</dt>
                    <dd className="text-orange-600">${cartTotal.toFixed(2)}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-center text-xs text-gray-400">
                  Secure checkout · Free delivery · Fresh guarantee
                </p>

                <Link
                  to="/cart"
                  className="mt-4 block text-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
                >
                  ← Back to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;