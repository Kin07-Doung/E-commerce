import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useAlert();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/admin/orders/all?page=${page}&limit=20${
          filterStatus !== 'all' ? `&status=${filterStatus}` : ''
        }`
      );
      setOrders(res.data.orders || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order))
      );
      showSuccess(`Order #${id} updated to ${status}`);
    } catch {
      showError('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      shipped: 'bg-violet-50 text-violet-700 ring-violet-600/20',
      delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      completed: 'bg-green-50 text-green-700 ring-green-600/20',
      cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
    };
    const style = styles[status] || styles.pending;
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
      >
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      searchTerm === '' ||
      order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading orders…</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="All Orders"
        description="Admin dashboard for managing and tracking customer orders."
        url="/admin/orders"
        noIndex
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track customer orders
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {orders.length} on this page
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
              placeholder="Search by order ID, name, or address…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Payment
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Items
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Total
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Guest'}
                        </p>
                        <p className="mt-0.5 max-w-[180px] truncate text-xs text-gray-500">
                          {order.shipping_address || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm capitalize text-gray-600">
                        {order.payment_method || 'cash'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {order.items?.length || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">
                        ${parseFloat(order.total).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm text-gray-700">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="w-full min-w-[130px] rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <p className="text-sm font-medium text-gray-900">
                        No orders found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                          ? 'Try adjusting your search or filter'
                          : 'Orders will appear here when customers place them'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;