import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showError } = useAlert();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders?page=${page}&limit=20`);
        setOrders(res.data.orders || res.data);
        setTotalPages(res.data.totalPages || 1);
        setError('');
      } catch {
        setError('Failed to load orders');
        showError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [page, showError]);

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

  const getProgressWidth = (status) => {
    const map = {
      pending: 'w-1/4',
      processing: 'w-1/2',
      shipped: 'w-3/4',
      delivered: 'w-full',
      completed: 'w-full',
      cancelled: 'w-full',
    };
    return map[status?.toLowerCase()] || 'w-1/4';
  };

  const getProgressColor = (status) => {
    const map = {
      pending: 'bg-amber-500',
      processing: 'bg-blue-500',
      shipped: 'bg-violet-500',
      delivered: 'bg-emerald-500',
      completed: 'bg-emerald-500',
      cancelled: 'bg-red-500',
    };
    return map[status?.toLowerCase()] || 'bg-gray-400';
  };

  const getProgressLabel = (status) => {
    const map = {
      pending: 'Order placed',
      processing: 'Processing',
      shipped: 'On the way',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return map[status?.toLowerCase()] || status;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading orders…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Unable to load orders</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Orders"
        description="Track and manage your orders. View order history and delivery status."
        url="/orders"
        noIndex
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                My orders
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage your order history
              </p>
            </div>
            {orders.length > 0 && (
              <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 sm:mt-0">
                {orders.length} on this page
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">No orders yet</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                You haven’t placed any orders. Browse our products to get started.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  Browse products
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Order list */}
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold font-mono text-gray-900">
                            #{order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        {order.shipping_address && (
                          <p className="mt-1.5 truncate text-sm text-gray-500">
                            {order.shipping_address}
                          </p>
                        )}
                        {order.items && order.items.length > 0 && (
                          <p className="mt-1 text-xs text-gray-400">
                            {order.items.length}{' '}
                            {order.items.length === 1 ? 'item' : 'items'}
                            {order.items.slice(0, 2).map((item, idx) => (
                              <span key={idx}>
                                {' · '}
                                {item.product_name}
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <span> · +{order.items.length - 2} more</span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <p className="text-xs text-gray-400">
                            {formatDate(order.created_at)}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${parseFloat(order.total).toFixed(2)}
                          </p>
                        </div>
                        <svg
                          className="h-5 w-5 shrink-0 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${getProgressWidth(
                            order.status
                          )} ${getProgressColor(order.status)}`}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-gray-500">
                        {getProgressLabel(order.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page <span className="font-medium text-gray-900">{page}</span> of{' '}
                    {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;