import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useAlert();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch {
        showError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id, showError]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      shipped: 'bg-violet-50 text-violet-700 ring-violet-600/20',
      delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      completed: 'bg-green-50 text-green-700 ring-green-600/20',
      cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    const style = styles[status?.toLowerCase()] || 'bg-gray-50 text-gray-700 ring-gray-600/20';
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Order not found</h2>
          <p className="mt-2 text-sm text-gray-500">
            We couldn’t find this order. It may have been removed or the link is invalid.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  const status = order.status?.toLowerCase();

  return (
    <>
      <SEO
        title={`Order #${order.id}`}
        description={`View details for order #${order.id}.`}
        url={`/orders/${id}`}
        noIndex
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            to="/orders"
            className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to orders
          </Link>

          {/* Header card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Order #{order.id}
                  </h1>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {formatDate(order.created_at)} at {formatTime(order.created_at)}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
              <div className="bg-white px-4 py-3 sm:px-5">
                <p className="text-xs font-medium text-gray-500">Total</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  ${parseFloat(order.total).toFixed(2)}
                </p>
              </div>
              <div className="bg-white px-4 py-3 sm:px-5">
                <p className="text-xs font-medium text-gray-500">Payment</p>
                <p className="mt-0.5 text-sm font-medium capitalize text-gray-900">
                  {order.payment_method || 'Cash'}
                </p>
              </div>
              <div className="bg-white px-4 py-3 sm:px-5">
                <p className="text-xs font-medium text-gray-500">Items</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">
                  {order.items?.length || 0}
                </p>
              </div>
              <div className="bg-white px-4 py-3 sm:px-5">
                <p className="text-xs font-medium text-gray-500">Date</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Items ({order.items?.length || 0})
              </h2>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-white px-3 py-3 sm:px-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      {item.product_image ? (
                        <img
                          loading="lazy"
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping address */}
            {order.shipping_address && (
              <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  Shipping address
                </h2>
                <p className="whitespace-pre-line text-sm text-gray-600">
                  {order.shipping_address}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Order timeline
              </h2>
              <ol className="relative space-y-4 border-l border-gray-200 pl-4">
                <li className="relative">
                  <span className="absolute -left-[1.3rem] flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white" />
                  <p className="text-sm font-medium text-gray-900">Order placed</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.created_at)} at {formatTime(order.created_at)}
                  </p>
                </li>
                {status !== 'pending' && status !== 'cancelled' && (
                  <li className="relative">
                    <span className="absolute -left-[1.3rem] flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Processing</p>
                    <p className="text-xs text-gray-500">Order is being prepared</p>
                  </li>
                )}
                {(status === 'shipped' || status === 'delivered' || status === 'completed') && (
                  <li className="relative">
                    <span className="absolute -left-[1.3rem] flex h-3 w-3 items-center justify-center rounded-full bg-violet-500 ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Shipped</p>
                    <p className="text-xs text-gray-500">On the way to you</p>
                  </li>
                )}
                {(status === 'delivered' || status === 'completed') && (
                  <li className="relative">
                    <span className="absolute -left-[1.3rem] flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Delivered</p>
                    <p className="text-xs text-gray-500">Order completed</p>
                  </li>
                )}
                {status === 'cancelled' && (
                  <li className="relative">
                    <span className="absolute -left-[1.3rem] flex h-3 w-3 items-center justify-center rounded-full bg-red-500 ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Cancelled</p>
                    <p className="text-xs text-gray-500">This order was cancelled</p>
                  </li>
                )}
              </ol>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 px-5 py-4 sm:px-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/orders"
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                View all orders
              </Link>
              {status !== 'delivered' &&
                status !== 'completed' &&
                status !== 'cancelled' && (
                  <Link
                    to="/contact"
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Contact support
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;