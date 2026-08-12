import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const formatAddress = (a) => {
  if (!a) return '';
  const parts = [a.name, a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country, a.phone && `Phone: ${a.phone}`];
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
        const def = res.data.find((a) => a.is_default) || (res.data[0] && res.data[0]);
        if (def) {
          setSelectedAddress(String(def.id));
        } else if (res.data.length === 0) {
          setSelectedAddress('manual');
        }
      } catch (err) {
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
      } catch (err) {
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
      showSuccess('🎉 Order placed successfully!');
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  if (addrLoading) {
    return (
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your order securely. Choose your delivery address and enjoy fresh food delivered to your doorstep."
        url="/checkout"
      />
      <div className="container py-8 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="p-3 bg-orange-100 rounded-xl">
          <span className="text-2xl">📦</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
          <p className="text-sm text-gray-500">Review your order and choose delivery address</p>
          <p className="font-handwritten text-orange-500 text-sm">
            Packed with care, delivered with love
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
             {/* Address Selection */}
               <div>
                 <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                   <span>📍</span> {addresses.length > 0 ? 'Select Delivery Address' : 'Delivery Address'}
                 </h3>
                 <div className="space-y-3">
                   {addresses.length > 0 && addresses.map((addr) => (
                     <label 
                       key={addr.id} 
                       className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                         selectedAddress === String(addr.id) 
                           ? 'border-orange-500 bg-orange-50 shadow-md' 
                           : 'border-orange-200 hover:border-orange-300 hover:bg-orange-50/50'
                       }`}
                     >
                       <input
                         type="radio"
                         name="address"
                         value={String(addr.id)}
                         checked={selectedAddress === String(addr.id)}
                         onChange={() => setSelectedAddress(String(addr.id))}
                         className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500"
                       />
                       <div className="flex-1">
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="text-sm font-semibold text-gray-800 whitespace-pre-line">
                             {formatAddress(addr)}
                           </span>
                           {addr.is_default && (
                             <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-0.5 rounded-full">
                               ⭐ Default
                             </span>
                           )}
                         </div>
                         {addr.label && (
                           <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1">
                             🏷️ {addr.label}
                           </span>
                         )}
                       </div>
                     </label>
                   ))}
                   
                   {/* Manual Address Option - always available */}
                   <label 
                     className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                       showManual || addresses.length === 0
                         ? 'border-orange-500 bg-orange-50 shadow-md' 
                         : 'border-orange-200 hover:border-orange-300 hover:bg-orange-50/50'
                     }`}
                   >
                     <input
                       type="radio"
                       name="address"
                       value="manual"
                       checked={showManual || addresses.length === 0}
                       onChange={() => setSelectedAddress('manual')}
                       className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500"
                     />
                     <span className="text-sm text-gray-700 flex items-center gap-2">
                       <span>✏️</span> Enter address manually
                     </span>
                   </label>
                 </div>
               </div>

              {/* Manual Address Input */}
               {(showManual || addresses.length === 0) && (
                <div className="animate-fadeIn">
                  <label className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-2">
                    <span>📝</span> Shipping Address
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={5} 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    required={!selectedAddrObj} 
                    placeholder="Enter your full delivery address...
                    
Example:
John Doe
123 Main Street
Apt 4B
New York, NY 10001
United States
Phone: (555) 123-4567"
                    className="w-full px-4 py-3 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-y placeholder:text-gray-400 min-h-[150px]"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    🛒 Place Order
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg sticky top-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <span>📋</span> Order Summary
            </h3>
            
             <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="font-medium text-gray-700">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-700">${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium text-gray-700">$0.00</span>
              </div>
              <div className="border-t-2 border-orange-200 pt-3 flex justify-between">
                <span className="text-base font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-orange-600">${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-orange-100">
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-3 rounded-xl">
                <span>✅</span>
                <span>Free delivery on orders over $50</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🔒</span> Secure payment
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>🔄</span> Easy returns
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>⭐</span> Fresh guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
