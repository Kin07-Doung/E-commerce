import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { showSuccess, showError } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data.products || productsRes.data);
        setCategories(categoriesRes.data.categories || categoriesRes.data);
        
        if (user) {
          const wishlistRes = await api.get('/wishlist');
          const ids = new Set((wishlistRes.data || []).map(p => p.id));
          setWishlistIds(ids);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearch(searchParam);
    }
    if (catParam && categories.length > 0) {
      const matched = categories.find(c => c.name.toLowerCase() === catParam.toLowerCase());
      if (matched) {
        setSelectedCategory(matched.id);
      } else {
        setSelectedCategory(null);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('🛒 Added to cart!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const res = await api.post(`/wishlist/${product.id}`);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (res.data.inWishlist) {
          next.add(product.id);
        } else {
          next.delete(product.id);
        }
        return next;
      });
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess(res.data.inWishlist ? '❤️ Added to wishlist' : '💔 Removed from wishlist');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
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
      'snacks': '🍿',
      'desserts': '🍰'
    };
    if (!categoryName) return '🏷️';
    const lowerName = categoryName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '🏷️';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading delicious food...</p>
          <div className="flex gap-2 text-2xl">
            <span className="animate-bounce delay-0">🍕</span>
            <span className="animate-bounce delay-150">🍔</span>
            <span className="animate-bounce delay-300">🌮</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float">🍕</div>
          <div className="absolute bottom-20 right-20 text-8xl animate-float-delayed">🍔</div>
          <div className="absolute top-1/2 left-1/2 text-8xl animate-float-slow">🌮</div>
          <div className="absolute bottom-40 left-1/4 text-6xl animate-float">🍣</div>
          <div className="absolute top-20 right-1/4 text-7xl animate-float-delayed">🥗</div>
        </div>
         <div className="container relative text-center px-4">
           <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
           <p className="text-orange-100 text-lg max-w-2xl mx-auto font-handwritten text-2xl mt-2">
             Curated by real people, not robots
           </p>
         </div>
      </div>

      {/* Products Section */}
      <div className="container py-8 px-4 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl border-2 border-orange-200 p-4 shadow-lg">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="🔍 Search for food..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
            />
            <svg className="w-4 h-4 text-orange-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button 
              onClick={() => setSelectedCategory(null)} 
              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                !selectedCategory 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md' 
                  : 'bg-white border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              🍽️ All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)} 
                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                  selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md' 
                    : 'bg-white border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                }`}
              >
                {getCategoryEmoji(cat.name)} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {paginated.length} of {filtered.length} products</span>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
            >
              Clear filter ✕
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-16 text-center shadow-lg">
            <span className="text-8xl block mb-6">🔍</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any products matching your search.</p>
            <button 
              onClick={() => { setSearch(''); setSelectedCategory(null); }} 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginated.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  wishlistIds={wishlistIds} 
                  onToggleWishlist={toggleWishlist} 
                />
              ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Products;