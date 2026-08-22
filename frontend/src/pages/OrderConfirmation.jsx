import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const OrderConfirmation = () => {
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

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Order Confirmed"
        description={`Thank you for your order #${order.id}.`}
        url={`/order-confirmation/${id}`}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Order confirmed
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Thank you. We’ve received your order and will start preparing it shortly.
            </p>
          </div>

          {/* Order card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Order ID</p>
                  <p className="mt-0.5 text-sm font-semibold font-mono text-gray-900">
                    #{order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              {/* Total */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-600">Order total</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${parseFloat(order.total).toFixed(2)}
                </span>
              </div>

              {/* Estimated delivery */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Estimated delivery
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {getEstimatedDelivery()}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">Free delivery on this order</p>
              </div>

              {/* Shipping address */}
              {order.shipping_address && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Shipping address
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                    {order.shipping_address}
                  </p>
                </div>
              )}

              {/* Items preview */}
              {order.items && order.items.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                    Items ({order.items.length})
                  </p>
                  <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                    {order.items.slice(0, 4).map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between gap-2 px-3 py-2.5 text-sm"
                      >
                        <span className="min-w-0 truncate text-gray-700">
                          {item.product_name || `Item ${index + 1}`}
                          {item.quantity > 1 && (
                            <span className="text-gray-400"> × {item.quantity}</span>
                          )}
                        </span>
                        <span className="shrink-0 font-medium text-gray-900">
                          ${parseFloat(item.price || 0).toFixed(2)}
                        </span>
                      </li>
                    ))}
                    {order.items.length > 4 && (
                      <li className="px-3 py-2 text-center text-xs text-gray-400">
                        + {order.items.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 px-5 py-4 sm:px-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/products"
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Continue shopping
              </Link>
              <Link
                to="/orders"
                className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View orders
              </Link>
            </div>
          </div>

          {/* Help */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Need help?{' '}
            <Link
              to="/contact"
              className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;