import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

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
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=20`);
      const data = res.data;
      setUsers(data.users || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(user => user.id === id ? { ...user, role: newRole } : user));
      showSuccess(`✅ User role updated to ${newRole}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('🗑️ Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      showSuccess('🗑️ User deleted successfully');
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
      setUsers(prev => prev.map(u => u.id === editUser.id ? res.data : u));
      setEditUser(null);
      showSuccess(`✅ User "${editForm.name}" updated successfully`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          <span>👑</span> Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <span>👤</span> User
      </span>
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-orange-600 font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            <p className="text-sm text-gray-500">Manage your customers and staff</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-orange-200 px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-orange-600">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[450px] scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-orange-50/50 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 20 + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-orange-200">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">{new Date(user.created_at).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Dropdown 
                      trigger={
                        <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                          <span className="text-xl">⋮</span>
                        </button>
                      }
                    >
                      <button
                        onClick={() => handleView(user)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                      >
                        <span>👁️</span> View
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                      >
                        <span>✏️</span> Edit
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-6xl">👥</span>
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-sm text-gray-400">Users will appear here as they register</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
            <span className="text-sm font-medium text-gray-700">Page</span>
            <span className="text-sm font-bold text-orange-600">{page}</span>
            <span className="text-sm text-gray-500">of {totalPages}</span>
          </div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next →
          </button>
        </div>
      )}

      {/* View User Modal */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <span className="text-xl font-bold text-gray-800">User Details</span>
          </div>
        }
        size="md"
      >
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-200">
                {getInitials(viewUser.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{viewUser.name}</h3>
                <span className="text-sm text-gray-500">{viewUser.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{getRoleBadge(viewUser.role)}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-semibold text-gray-800 mt-1 capitalize">{viewUser.provider}</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-orange-200">
              <p className="text-xs text-gray-500">User ID</p>
              <p className="text-sm font-mono text-gray-700">#{viewUser.id}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-orange-200">
              <p className="text-xs text-gray-500">Joined</p>
              <p className="text-sm text-gray-700 mt-1">{new Date(viewUser.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <span className="text-xl font-bold text-gray-800">Edit User</span>
          </div>
        }
        size="md"
      >
        {editUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(editUser.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Editing: {editUser.name}</p>
                <p className="text-xs text-gray-400">#{editUser.id}</p>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>👤</span> Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>👑</span> Role
              </label>
              <select
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              >
                <option value="user">👤 User</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2 border-t-2 border-orange-200 pt-4">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                💾 Save Changes
              </button>
              <button 
                type="button" 
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => setEditUser(null)}
              >
                ✖ Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;