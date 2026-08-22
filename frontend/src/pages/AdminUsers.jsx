import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Dropdown from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: '' });
  const { showSuccess, showError } = useAlert();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=20`);
      const data = res.data;
      setUsers(data.users || data);
      setTotalPages(data.totalPages || 1);
    } catch {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      showSuccess('User deleted');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleView = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user.id}`);
      setViewUser(res.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load user');
    }
  };

  const handleEdit = (user) => {
    setEditForm({ name: user.name, role: user.role });
    setEditUser(user);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/users/${editUser.id}`, editForm);
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data : u))
      );
      setEditUser(null);
      showSuccess(`User "${editForm.name}" updated`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
        Customer
      </span>
    );
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading users…</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Users"
        description="Admin dashboard for managing customers and staff accounts."
        url="/admin/users"
        noIndex
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Users
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customers and staff accounts
            </p>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {users.length} on this page
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    #
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    User
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Role
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-400">
                      {(page - 1) * 20 + index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                            {currentUser?.id === user.id && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5">{getRoleBadge(user.role)}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm text-gray-700">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(user.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Dropdown
                        trigger={
                          <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        }
                      >
                        <button
                          onClick={() => handleView(user)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        {currentUser?.id !== user.id && (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </Dropdown>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <p className="text-sm font-medium text-gray-900">
                        No users found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Users will appear here as they register
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

        {/* View modal */}
        <Modal
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
          title="User details"
          size="md"
        >
          {viewUser && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-lg font-semibold text-orange-700">
                  {getInitials(viewUser.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {viewUser.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">{viewUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">Role</p>
                  <div className="mt-1">{getRoleBadge(viewUser.role)}</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">Provider</p>
                  <p className="mt-0.5 text-sm font-medium capitalize text-gray-900">
                    {viewUser.provider || '—'}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500">User ID</p>
                <p className="mt-0.5 text-sm font-mono text-gray-900">
                  #{viewUser.id}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500">Joined</p>
                <p className="mt-0.5 text-sm text-gray-900">
                  {new Date(viewUser.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit modal */}
        <Modal
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          title="Edit user"
          size="md"
        >
          {editUser && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                  {getInitials(editUser.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {editUser.name}
                  </p>
                  <p className="text-xs text-gray-500">#{editUser.id}</p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="user">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminUsers;