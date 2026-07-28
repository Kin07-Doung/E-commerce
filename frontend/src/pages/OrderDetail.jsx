import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container py-20 text-center">Loading...</div>;
  if (!order) return <div className="container py-20 text-center">Order not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/orders" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 font-medium">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Orders
      </Link>
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Order #{order.id}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {order.status}
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Items</h3>
          <div className="space-y-3 mb-6">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{item.product_name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <p className="font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Ship to:</p>
              <p className="text-sm text-slate-700">{order.shipping_address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-800">${parseFloat(order.total).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
