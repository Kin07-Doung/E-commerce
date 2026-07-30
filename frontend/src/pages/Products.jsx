import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAlert } from '../context/AlertContext';

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data.products || res.data);
    }).catch(() => {});
    api.get('/categories').then(res => {
      const data = res.data;
      setCategories(data.categories || data);
    }).catch(() => {});
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('Added to cart!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;
  const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search]);

  return (
    <div className="space-y-8">
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-blue-100 text-lg">Discover our complete collection of premium products</p>
        </div>
      </div>
      <div className="container space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${!selectedCategory ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>All Products</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedCategory === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-500 text-lg mb-2">No products found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginated.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 items-center">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                <span className="px-4 py-2 text-sm text-slate-500">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
