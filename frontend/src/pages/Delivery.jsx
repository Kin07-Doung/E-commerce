import React from 'react';
import { Link } from 'react-router-dom';

const Delivery = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🚚</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Delivery Information</h2>
            <p className="text-sm text-gray-500">Fast and reliable delivery to your doorstep</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h3 className="font-bold text-gray-800 mb-2">🚚 Standard Delivery</h3>
            <p className="text-sm text-gray-600">1-2 business days. Free on orders over $50.</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h3 className="font-bold text-gray-800 mb-2">⚡ Express Delivery</h3>
            <p className="text-sm text-gray-600">Same-day delivery for orders placed before 2 PM. Additional fees apply.</p>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">📍 Delivery Areas</h3>
          <p className="text-sm text-gray-600">We currently deliver to Culinary City and surrounding areas. Enter your address at checkout to confirm availability.</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-2">💡 Delivery Tips</h3>
          <p className="text-sm text-gray-600">Please ensure someone is available to receive the delivery. Refrigerated items should be stored promptly upon arrival.</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">← Back to Store</Link>
      </div>
    </div>
  );
};

export default Delivery;
