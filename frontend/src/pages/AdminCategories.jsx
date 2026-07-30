import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useAlert } from '../context/AlertContext';
import Alert from '../components/ui/Alert';

const CATEGORIES_PER_PAGE = 15;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await api.get('/categories');
    const data = res.data;
    setCategories(data.categories || data);
    setTotalPages(data.totalPages || 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name });
      setName('');
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      await api.put(`/categories/${id}`, { name: editName });
      setEditingId(null);
      setEditName('');
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/categories', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'categories.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showError(err.response?.data?.message || 'Export failed');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/admin/import/categories', data);
      showSuccess(`Import complete: ${res.data.imported} imported, ${res.data.failed} failed`);
      loadCategories();
    } catch (err) {
      showError(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const paginated = categories.slice((page - 1) * CATEGORIES_PER_PAGE, page * CATEGORIES_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [categories.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="success" onClick={handleExport}>Export CSV</Button>
          <label className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Category</h3>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary">Add Category</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginated.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-800">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  {editingId === cat.id ? (
                    <div className="flex gap-2 justify-end">
                      <Button variant="textSuccess" size="sm" onClick={() => handleUpdate(cat.id)}>Save</Button>
                      <Button variant="text" size="sm" onClick={() => { setEditingId(null); setEditName(''); }}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <Button variant="textPrimary" size="sm" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>Edit</Button>
                      <Button variant="textDanger" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-slate-500 text-sm">No categories yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
          <span className="px-4 py-2 text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
