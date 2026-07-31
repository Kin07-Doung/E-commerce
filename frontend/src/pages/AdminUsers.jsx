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
      showSuccess(`User role updated to ${newRole}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
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
      setUsers(prev => prev.map(u => u.id === editUser.id ? res.data : u));
      setEditUser(null);
      showSuccess('User updated');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">All Users</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-y-auto max-h-[350px] scrollbar-light">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">{(page - 1) * 20 + index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <Dropdown trigger={<span>⋮</span>}>
                    <button
                      onClick={() => handleView(user)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    {currentUser?.id !== user.id && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
          <span className="px-4 py-2 text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
        </div>
      )}

      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="User Details"
        size="md"
      >
        {viewUser && (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-slate-500">ID:</span>
              <span className="ml-2 text-slate-800">{viewUser.id}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Name:</span>
              <span className="ml-2 text-slate-800">{viewUser.name}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Email:</span>
              <span className="ml-2 text-slate-800">{viewUser.email}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Role:</span>
              <span className="ml-2 text-slate-800 capitalize">{viewUser.role}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Provider:</span>
              <span className="ml-2 text-slate-800">{viewUser.provider}</span>
            </div>
            <div>
              <span className="font-medium text-slate-500">Joined:</span>
              <span className="ml-2 text-slate-800">{new Date(viewUser.created_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        size="md"
      >
        {editUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
              <select
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md">Save</Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setEditUser(null)}>Cancel</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
