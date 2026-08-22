import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Dropdown from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import { useAlert } from '../context/AlertContext';
import Alert from '../components/ui/Alert';
import SEO from '../components/SEO';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏷️');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('🏷️');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewCategory, setViewCategory] = useState(null);
  const { showSuccess, showError } = useAlert();

  const getCategoryEmoji = (name) => {
    const emojis = {
      bakery: '🍞', dairy: '🥛', meat: '🥩', seafood: '🐟', fish: '🐟',
      fruits: '🍎', fruit: '🍎', vegetables: '🥬', vegetable: '🥬',
      organic: '🌿', fresh: '✨', seasonal: '🍂', spices: '🌶️',
      beverages: '🥤', drinks: '🥤', snacks: '🍿', desserts: '🍰', dessert: '🍰',
      bread: '🍞', pasta: '🍝', rice: '🍚', sauce: '🥫', sauces: '🥫',
      oil: '🫒', oils: '🫒', herbs: '🌿', spice: '🌶️', cheese: '🧀',
      eggs: '🥚', egg: '🥚', milk: '🥛', yogurt: '🫗', chicken: '🍗',
      beef: '🥩', pork: '🥓', lamb: '🍖',
    };
    if (!name) return '🏷️';
    const lower = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lower.includes(key)) return emoji;
    }
    return '🏷️';
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

  const loadCategories = async () => {
    try {
      const res = await api.get(`/categories?page=${page}&limit=20`);
      const data = res.data;
      setCategories(data.categories || data);
      setTotalPages(data.totalPages || 1);
    } catch {
      showError('Failed to load categories');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name, description, icon });
      setName('');
      setDescription('');
      setIcon('🏷️');
      loadCategories();
      showSuccess(`Category "${name}" created`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      await api.put(`/categories/${id}`, {
        name: editName,
        description: editDescription,
        icon: editIcon,
      });
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      setEditIcon('🏷️');
      loadCategories();
      showSuccess(`Category "${editName}" updated`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
      showSuccess('Category deleted');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleView = async (cat) => {
    try {
      const res = await api.get(`/categories/${cat.id}`);
      setViewCategory(res.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load category');
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
      showSuccess('Categories exported');
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

  return (
    <>
      <SEO
        title="Food Categories"
        description="Admin dashboard for managing product categories."
        url="/admin/categories"
        noIndex
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Organize products into categories
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <label className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors cursor-pointer">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {importing ? 'Importing…' : 'Import'}
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
        </div>

        {/* Add category */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Add category</h2>
          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Bakery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <input
                type="text"
                placeholder="Optional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
              <input
                type="text"
                placeholder="🏷️"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-center focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              Add category
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">#</th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Category</th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Description</th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Products</th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-400">
                      {(page - 1) * 20 + index + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === cat.id ? (
                        <div className="space-y-2 max-w-xs">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Icon"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl leading-none">
                            {cat.icon || getCategoryEmoji(cat.name)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full max-w-xs rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">
                          {cat.description || '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {cat.product_count || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {editingId === cat.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            className="rounded-md bg-orange-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditName('');
                              setEditDescription('');
                              setEditIcon('🏷️');
                            }}
                            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <Dropdown
                          trigger={
                            <div className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </div>
                          }
                        >
                          <button
                            onClick={() => handleView(cat)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditName(cat.name);
                              setEditDescription(cat.description || '');
                              setEditIcon(cat.icon || '🏷️');
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </Dropdown>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <p className="text-sm font-medium text-gray-900">No categories yet</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Create your first category using the form above
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
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page <span className="font-medium text-gray-900">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* View modal */}
        <Modal
          isOpen={!!viewCategory}
          onClose={() => setViewCategory(null)}
          title="Category details"
          size="md"
        >
          {viewCategory && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="text-4xl leading-none">
                  {viewCategory.icon || getCategoryEmoji(viewCategory.name)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {viewCategory.name}
                  </h3>
                  {viewCategory.description && (
                    <p className="mt-0.5 text-sm text-gray-500">
                      {viewCategory.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">ID</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">
                    #{viewCategory.id}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">Products</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">
                    {viewCategory.product_count || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminCategories;