import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  if (!order) return <div className="container py-20 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-sm text-slate-500 mb-1">Order ID: #{order.id}</p>
          <p className="text-sm text-slate-500 mb-6">Status: {order.status}</p>
          <p className="text-2xl font-bold text-slate-800 mb-6">Total: ${parseFloat(order.total).toFixed(2)}</p>
          <Link to="/products" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
