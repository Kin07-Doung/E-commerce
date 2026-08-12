import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/ui/Button';
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

  // Food category emoji mappings
  const getCategoryEmoji = (name) => {
    const emojis = {
      'bakery': '🍞',
      'dairy': '🥛',
      'meat': '🥩',
      'seafood': '🐟',
      'fish': '🐟',
      'fruits': '🍎',
      'fruit': '🍎',
      'vegetables': '🥬',
      'vegetable': '🥬',
      'organic': '🌿',
      'fresh': '✨',
      'seasonal': '🍂',
      'spices': '🌶️',
      'beverages': '🥤',
      'drinks': '🥤',
      'snacks': '🍿',
      'desserts': '🍰',
      'dessert': '🍰',
      'bread': '🍞',
      'pasta': '🍝',
      'rice': '🍚',
      'sauce': '🥫',
      'sauces': '🥫',
      'oil': '🫒',
      'oils': '🫒',
      'herbs': '🌿',
      'spice': '🌶️',
      'cheese': '🧀',
      'eggs': '🥚',
      'egg': '🥚',
      'milk': '🥛',
      'yogurt': '🫗',
      'chicken': '🍗',
      'beef': '🥩',
      'pork': '🥓',
      'lamb': '🍖',
      'seafood': '🦐'
    };
    
    if (!name) return '🏷️';
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
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
    } catch (err) {
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
      showSuccess(`✅ Category "${name}" created successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      await api.put(`/categories/${id}`, { name: editName, description: editDescription, icon: editIcon });
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      setEditIcon('🏷️');
      loadCategories();
      showSuccess(`✅ Category "${editName}" updated successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('🗑️ Delete this category? Products in this category will become uncategorized.')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
      showSuccess('🗑️ Category deleted successfully');
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
      showSuccess('📥 Categories exported successfully!');
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
      showSuccess(`📥 Import complete: ${res.data.imported} imported, ${res.data.failed} failed`);
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
        description="Admin dashboard for managing product categories and organization."
        url="/admin/categories"
        noIndex
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🏷️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Food Categories</h2>
            <p className="text-sm text-gray-500">Manage your product categories</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExport} 
            className="bg-white text-orange-600 border-2 border-orange-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
          <label className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-2">
            <span>📤</span> Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">➕</span>
          Add New Category
        </h3>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Category name (e.g., Bakery)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
          />
          <input
            type="text"
            placeholder="Icon emoji (e.g., 🍞)"
            value={icon}
            onChange={e => setIcon(e.target.value)}
            className="w-20 px-3 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400 text-center"
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap flex items-center gap-2"
          >
            <span>➕</span> Add Category
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[450px] scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-orange-50/50 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 20 + index + 1}</td>
                   <td className="px-6 py-4">
                     {editingId === cat.id ? (
                       <div className="space-y-2">
                         <input
                           type="text"
                           value={editName}
                           onChange={e => setEditName(e.target.value)}
                           className="px-3 py-1.5 border-2 border-orange-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 w-full"
                           placeholder="Name"
                         />
                         <input
                           type="text"
                           value={editIcon}
                           onChange={e => setEditIcon(e.target.value)}
                           className="px-3 py-1.5 border-2 border-orange-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 w-full"
                           placeholder="Icon emoji"
                         />
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                         <span className="text-2xl">{cat.icon || getCategoryEmoji(cat.name)}</span>
                         <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                       </div>
                     )}
                   </td>
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="px-3 py-1.5 border-2 border-orange-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{cat.description || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <span>📦</span>
                      {cat.product_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {editingId === cat.id ? (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleUpdate(cat.id)} 
                          className="text-xs font-medium bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          💾 Save
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setEditName(''); setEditDescription(''); }} 
                          className="text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          ✖ Cancel
                        </button>
                      </div>
                    ) : (
                      <Dropdown 
                        trigger={
                          <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                            <span className="text-xl">⋮</span>
                          </button>
                        }
                      >
                        <button
                          onClick={() => handleView(cat)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <span>👁️</span> View
                        </button>
                        <button
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditDescription(cat.description || ''); setEditIcon(cat.icon || '🏷️'); }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </Dropdown>
                    )}
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-6xl">🍽️</span>
                      <p className="text-gray-500 font-medium">No categories yet</p>
                      <p className="text-sm text-gray-400">Add your first category to get started</p>
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

      {/* View Category Modal */}
      <Modal
        isOpen={!!viewCategory}
        onClose={() => setViewCategory(null)}
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <span className="text-xl font-bold text-gray-800">Category Details</span>
          </div>
        }
        size="md"
      >
        {viewCategory && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              <span className="text-6xl">{getCategoryEmoji(viewCategory.name)}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{viewCategory.name}</h3>
                {viewCategory.description && (
                  <p className="text-sm text-gray-600">{viewCategory.description}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Category ID</p>
                <p className="text-sm font-mono font-semibold text-gray-800">#{viewCategory.id}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Products</p>
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                  <span>📦</span> {viewCategory.product_count || 0} products
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

