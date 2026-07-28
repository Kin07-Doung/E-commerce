import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.get('/cart').then(res => setItems(res.data)).catch(() => {});
    }
  }, [user]);

  const updateQuantity = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity });
    api.get('/cart').then(res => setItems(res.data));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    api.get('/cart').then(res => setItems(res.data));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p>Please <Link to="/login" className="text-blue-500 font-medium">login</Link> to view your cart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Shopping Cart</h2>
        <span className="text-sm text-slate-500">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-blue-600 font-medium hover:text-blue-700">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 overflow-x-auto">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden min-w-[700px]">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                           <img loading="lazy" src={item.image_url || 'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20300%20300%22%3E%3Crect%20fill=%22%23e2e8f0%22%20width=%22300%22%20height=%22300%22/%3E%3Ctext%20fill=%22%2394a3b8%22%20font-family=%22sans-serif%22%20font-size=%2216%22%20x=%2250%25%22%20y=%2250%25%22%20text-anchor=%22middle%22%20dy=%22.3em%22%3ENo%20Image%3C/text%3E%3C/svg%3E'} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                          <div>
                            <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-slate-800 hover:text-blue-600">{item.name}</Link>
                            <p className="text-xs text-slate-500 mt-0.5">{item.category_name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">-</button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (0%)</span>
                <span className="font-medium text-slate-800">$0.00</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-base font-bold text-slate-800">Total</span>
                <span className="text-base font-bold text-slate-800">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;




