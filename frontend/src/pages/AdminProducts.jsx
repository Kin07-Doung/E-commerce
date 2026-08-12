import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '', barcode: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSuccess, showError } = useAlert();

  const loadProducts = async () => {
    try {
      const res = await api.get(`/admin/products?page=${page}&limit=20`);
      const data = res.data;
      setProducts(data.products || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.categories || res.data);
  };

  const getCategoryEmoji = (categoryName) => {
    const emojis = {
      'bakery': '🍞',
      'dairy': '🥛',
      'meat': '🥩',
      'seafood': '🐟',
      'fruits': '🍎',
      'vegetables': '🥬',
      'organic': '🌿',
      'fresh': '✨',
      'seasonal': '🍂',
      'spices': '🌶️',
      'beverages': '🥤',
      'snacks': '🍿'
    };
    if (!categoryName) return '🏷️';
    const lowerName = categoryName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '🏷️';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('category_id', form.category_id);
      if (imageFile) {
        data.append('image', imageFile);
      }
      data.append('barcode', form.barcode);

      const url = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products';
      const method = editingProduct ? api.put : api.post;
      const response = await method(url, data);
      showSuccess(`✅ ${editingProduct ? 'Updated' : 'Added'} product "${response.data.name || form.name}" successfully!`);
      setShowForm(false);
      setEditingProduct(null);
      setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '', barcode: '' });
      setImagePreview('');
      setImageFile(null);
      loadProducts();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Operation failed';
      showError(msg);
      console.error('Product submit error:', err.response || err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id?.toString() || '',
      image_url: product.image_url || '',
      barcode: product.barcode || ''
    });
    setImagePreview(product.image_url || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('🗑️ Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      loadProducts();
      showSuccess('🗑️ Product deleted successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleView = async (product) => {
    try {
      const res = await api.get(`/admin/products/${product.id}`);
      setViewProduct(res.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load product');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/products', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess('📥 Products exported successfully!');
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
      const res = await api.post('/admin/import/products', data);
      showSuccess(`📥 Import complete: ${res.data.imported} imported, ${res.data.failed} failed`);
      loadProducts();
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
        title="Products"
        description="Admin dashboard for managing product inventory, prices, and stock."
        url="/admin/products"
        noIndex
      />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500">Manage your food inventory</p>
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
          <button 
            onClick={() => { setShowForm(true); setEditingProduct(null); setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '', barcode: '' }); setImagePreview(''); setImageFile(null); }} 
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span>➕</span> Add Product
          </button>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">{editingProduct ? '✏️' : '➕'}</span>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>📦</span> Product Name
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Organic Bread" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>🏷️</span> Category
              </label>
              <select 
                value={form.category_id} 
                onChange={e => setForm({...form, category_id: e.target.value})} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {getCategoryEmoji(cat.name)} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>💰</span> Price ($)
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>📊</span> Stock Quantity
                <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                placeholder="0" 
                value={form.stock} 
                onChange={e => setForm({...form, stock: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>📷</span> Product Image
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 file:cursor-pointer"
                />
                {(imagePreview || form.image_url) && (
                  <img loading="lazy" src={imagePreview || form.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-orange-200" />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>📱</span> Barcode
              </label>
              <input 
                type="text" 
                placeholder="Product barcode..." 
                value={form.barcode} 
                onChange={e => setForm({...form, barcode: e.target.value})} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>📝</span> Description
              </label>
              <textarea 
                placeholder="Product description..." 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                rows={3} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400 resize-y"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                {editingProduct ? '💾 Update Product' : '➕ Create Product'}
              </button>
              <button 
                type="button" 
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-orange-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => { setShowForm(false); setEditingProduct(null); setImagePreview(''); setImageFile(null); }}
              >
                ✖ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[450px] scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Barcode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-orange-50/50 transition-colors duration-150 group">
                  <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 20 + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img loading="lazy" src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover border-2 border-orange-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-2 border-orange-200">
                          <span className="text-2xl">🍽️</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{product.name}</span>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{product.barcode || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span>{getCategoryEmoji(product.category_name)}</span>
                      {product.category_name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-orange-600">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock < 10 && product.stock > 0 ? 'bg-amber-100 text-amber-700' :
                        product.stock === 0 ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.stock < 10 && product.stock > 0 && '⚠️ '}
                        {product.stock === 0 && '❌ '}
                        {product.stock}
                      </span>
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="text-xs text-amber-500 animate-pulse">Low stock!</span>
                      )}
                    </div>
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
                        onClick={() => handleView(product)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                      >
                        <span>👁️</span> View
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors flex items-center gap-2"
                      >
                        <span>✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </Dropdown>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-6xl">🍽️</span>
                      <p className="text-gray-500 font-medium">No products yet</p>
                      <p className="text-sm text-gray-400">Add your first product to get started</p>
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

      {/* View Product Modal */}
      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <span className="text-xl font-bold text-gray-800">Product Details</span>
          </div>
        }
        size="md"
      >
        {viewProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              {viewProduct.image_url ? (
                <img loading="lazy" src={viewProduct.image_url} alt={viewProduct.name} className="w-20 h-20 rounded-xl object-cover border-2 border-orange-200" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-2 border-orange-200">
                  <span className="text-4xl">🍽️</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-800">{viewProduct.name}</h3>
                <span className="inline-flex items-center gap-1 text-sm text-orange-600">
                  {getCategoryEmoji(viewProduct.category_name)} {viewProduct.category_name || 'Uncategorized'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-lg font-bold text-orange-600">${parseFloat(viewProduct.price).toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Stock</p>
                <p className={`text-lg font-bold ${viewProduct.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                  {viewProduct.stock} units
                </p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-orange-200">
              <p className="text-xs text-gray-500">Barcode</p>
              <p className="text-sm font-mono text-gray-700">{viewProduct.barcode || 'No barcode'}</p>
            </div>
            {viewProduct.description && (
              <div className="p-4 bg-white rounded-xl border border-orange-200">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700 mt-1">{viewProduct.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
    </>
  );
};

export default AdminProducts;

