import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams] = useSearchParams();
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
          api.get('/categories'),
        ]);
        setProducts(productsRes.data.products || productsRes.data);
        setCategories(categoriesRes.data.categories || categoriesRes.data);

        if (user) {
          const wishlistRes = await api.get('/wishlist');
          const ids = new Set((wishlistRes.data || []).map((p) => p.id));
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
    if (searchParam) setSearch(searchParam);
    if (catParam && categories.length > 0) {
      const matched = categories.find(
        (c) => c.name.toLowerCase() === catParam.toLowerCase()
      );
      setSelectedCategory(matched ? matched.id : null);
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, search]);

  const addToCart = async (product) => {
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess('Added to cart');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const res = await api.post(`/wishlist/${product.id}`);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (res.data.inWishlist) next.add(product.id);
        else next.delete(product.id);
        return next;
      });
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess(
        res.data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist'
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading products…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Products"
        description="Browse our selection of fresh ingredients and meals. Free delivery on orders over $50."
        url="/products"
      />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Fresh ingredients and meals, delivered to your door
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Search + filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-orange-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-orange-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {paginated.length} of {filtered.length}{' '}
              {filtered.length === 1 ? 'product' : 'products'}
            </span>
            {(selectedCategory || search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory(null);
                }}
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Grid / empty */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                No products found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory(null);
                }}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;