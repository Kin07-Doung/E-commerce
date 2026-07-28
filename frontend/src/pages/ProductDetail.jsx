import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Loading...</div>;
  if (error || !product) return <div className="flex items-center justify-center h-64 text-slate-500">{error || 'Product not found'}</div>;

  return (
    <div className="space-y-6">
      <Link to="/products" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 font-medium">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </Link>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-slate-50 flex items-center justify-center p-8">
             <img loading="lazy" src={product.image_url || 'https://via.placeholder.com/500'} alt={product.name} className="w-full max-w-md rounded-lg border border-slate-200" />
          </div>
          <div className="p-8">
            <p className="text-sm text-blue-600 font-medium mb-2">{product.category_name || 'Uncategorized'}</p>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600 mb-4">${parseFloat(product.price).toFixed(2)}</p>
            <div className="flex items-center gap-2 mb-6">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description || 'No description available.'}</p>
            <button onClick={addToCart} disabled={product.stock <= 0} className={`w-full py-3 rounded-lg font-medium transition-colors ${product.stock > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-400 text-white cursor-not-allowed'}`}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
