import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));

    if (user) {
      api
        .get('/wishlist')
        .then((res) => {
          const ids = new Set((res.data || []).map((p) => p.id));
          setInWishlist(ids.has(parseInt(id, 10)));
        })
        .catch(() => {});
    }
  }, [id, user]);

  const addToCart = async () => {
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      window.dispatchEvent(new Event('cart-updated'));
      showSuccess(
        `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      showError('Please login to add items to wishlist');
      return;
    }
    try {
      const res = await api.post(`/wishlist/${product.id}`);
      setInWishlist(res.data.inWishlist);
      window.dispatchEvent(new Event('wishlist-updated'));
      showSuccess(
        res.data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist'
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0)
      return { text: 'Out of stock', style: 'bg-red-50 text-red-700 ring-red-600/20' };
    if (stock < 10)
      return {
        text: `Only ${stock} left`,
        style: 'bg-amber-50 text-amber-700 ring-amber-600/20',
      };
    return {
      text: 'In stock',
      style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <>
        <SEO
          title="Product Not Found"
          description="The product you are looking for does not exist. Browse our full selection at Kin Shop."
          url="/products"
        />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Product not found</h2>
          <p className="mt-2 text-sm text-gray-500">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
      </>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <>
      <SEO
        title={product.name}
        description={
          product.description ||
          `Buy ${product.name}. Free delivery on orders over $50.`
        }
        image={product.image_url}
        url={`/products/${id}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || `Buy ${product.name} at Kin Shop.`,
          image: product.image_url
            ? `${product.image_url.startsWith('http') ? product.image_url : `https://e-order.student-edu.online${product.image_url}`}`
            : 'https://e-order.student-edu.online/og-image.png',
          sku: product.id,
          brand: {
            '@type': 'Brand',
            name: 'Kin Shop',
          },
          offers: {
            '@type': 'Offer',
            url: `https://e-order.student-edu.online/products/${product.id}`,
            priceCurrency: 'USD',
            price: parseFloat(product.price).toFixed(2),
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Kin Shop',
            },
          },
        }}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-orange-600 transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="truncate text-gray-900">{product.name}</span>
          </nav>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="flex items-center justify-center bg-gray-50 p-6 sm:p-10">
                {product.image_url ? (
                  <img
                    loading="lazy"
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-96 w-full max-w-md rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      className="h-16 w-16 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col p-6 sm:p-8">
                {product.category_name && (
                  <Link
                    to={`/products?category=${product.category_name.toLowerCase()}`}
                    className="mb-3 inline-flex w-fit items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {product.category_name}
                  </Link>
                )}

                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.old_price && (
                    <span className="text-base text-gray-400 line-through">
                      ${parseFloat(product.old_price).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${stockStatus.style}`}
                  >
                    {stockStatus.text}
                  </span>
                </div>

                {product.description && (
                  <div className="mt-6">
                    <h2 className="text-sm font-medium text-gray-900">Description</h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Quantity + actions */}
                <div className="mt-auto pt-8 space-y-4">
                  {product.stock > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Quantity</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-gray-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((q) => Math.min(product.stock, q + 1))
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">
                        Max {product.stock}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={addToCart}
                      disabled={product.stock <= 0}
                      className="flex-1 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
                    </button>
                    <button
                      type="button"
                      onClick={toggleWishlist}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        inWishlist
                          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600'
                      }`}
                      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {inWishlist ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <span>SKU: {product.id}</span>
                    <span>{product.stock} in stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category link */}
          {product.category_name && (
            <p className="mt-8 text-center text-sm text-gray-500">
              More in{' '}
              <Link
                to={`/products?category=${product.category_name.toLowerCase()}`}
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                {product.category_name}
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;