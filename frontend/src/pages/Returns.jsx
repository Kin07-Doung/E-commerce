import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Returns = () => {
  return (
    <>
      <SEO
        title="Returns Policy"
        description="Easy returns for your peace of mind. 24-hour return window for freshness concerns."
        url="/returns"
      />
      <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🔄</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Returns Policy</h2>
            <p className="text-sm text-gray-500">Easy returns for your peace of mind</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg space-y-4">
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">⏰ Return Window</h3>
          <p className="text-sm text-gray-600">We accept returns within 24 hours of delivery for freshness or quality concerns.</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">📦 How to Return</h3>
          <p className="text-sm text-gray-600">Contact our support team with your order number and reason for return. We will arrange a collection or provide a refund.</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">💰 Refunds</h3>
          <p className="text-sm text-gray-600">Refunds are processed within 3-5 business days after we receive the returned items.</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">❌ Non-Returnable Items</h3>
          <p className="text-sm text-gray-600">Perishable goods that have been opened or consumed cannot be returned unless they arrived damaged or defective.</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">← Back to Store</Link>
      </div>
    </div>
    </>
  );
};

export default Returns;
