import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await api.get('/admin/products');
    const data = res.data;
    setProducts(data.products || data);
  };

  const loadCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.categories || res.data);
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

      const url = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products';
      const method = editingProduct ? api.put : api.post;
      const response = await method(url, data);
      alert('Success: ' + (response.data.name || 'Product saved'));
      setShowForm(false);
      setEditingProduct(null);
      setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
      setImagePreview('');
      setImageFile(null);
      loadProducts();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Operation failed';
      alert('Error: ' + msg);
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
      image_url: product.image_url || ''
    });
    setImagePreview(product.image_url || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleExport = () => {
    window.open('/api/admin/export/products', '_blank');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/admin/import/products', data);
      alert(`Import complete: ${res.data.imported} imported, ${res.data.failed} failed`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Products</h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm">
            Export CSV
          </button>
          <label className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-sm cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
          <button onClick={() => { setShowForm(true); setEditingProduct(null); setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' }); setImagePreview(''); setImageFile(null); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Product Name</label>
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Price ($)</label>
              <input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Stock Qty</label>
              <input type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {(imagePreview || form.image_url) && (
                 <img loading="lazy" src={imagePreview || form.image_url} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded-lg border border-slate-200" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
              <textarea placeholder="Product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y" />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">{editingProduct ? 'Update Product' : 'Create Product'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); setImagePreview(''); setImageFile(null); }} className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img loading="lazy" src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    )}
                    <div>
                      <span className="text-sm font-medium text-slate-800">{product.name}</span>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{product.description || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{product.category_name || '-'}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">${parseFloat(product.price).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock}
                    </span>
                    <button
                      onClick={async () => {
                        const newStock = prompt('Enter new stock quantity:', product.stock);
                        if (newStock !== null && !isNaN(newStock)) {
                          try {
                            const formData = new FormData();
                            formData.append('name', product.name);
                            formData.append('description', product.description || '');
                            formData.append('price', product.price.toString());
                            formData.append('stock', parseInt(newStock).toString());
                            formData.append('category_id', product.category_id?.toString() || '');
                            formData.append('image_url', product.image_url || '');
                            await api.put(`/admin/products/${product.id}`, formData);
                            loadProducts();
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to update stock');
                          }
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-700 font-medium mr-3">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

