import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">About FoodHub</h2>
            <p className="text-sm text-gray-500">Fresh food delivered to your doorstep</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg space-y-4">
        <p className="text-gray-700 leading-relaxed">
          FoodHub is your one-stop shop for fresh, quality ingredients and delicious meals. We started with a simple mission: to bring the best of the culinary world right to your doorstep.
        </p>
        <p className="text-gray-700 leading-relaxed">
          With thousands of happy customers, we pride ourselves on fresh ingredients, fast delivery, and exceptional customer service. Our team works tirelessly to ensure every order meets the highest standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <span className="text-3xl block mb-2">🚚</span>
            <h3 className="font-bold text-gray-800">Free Delivery</h3>
            <p className="text-sm text-gray-600">On orders over $50</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <span className="text-3xl block mb-2">⭐</span>
            <h3 className="font-bold text-gray-800">Fresh Guarantee</h3>
            <p className="text-sm text-gray-600">Quality ingredients always</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <span className="text-3xl block mb-2">💬</span>
            <h3 className="font-bold text-gray-800">24/7 Support</h3>
            <p className="text-sm text-gray-600">Here to help anytime</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">← Back to Store</Link>
      </div>
    </div>
  );
};

export default About;
