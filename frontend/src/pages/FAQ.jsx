import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQ = () => {
  const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery takes 1-2 business days. Express delivery is available for same-day orders placed before 2 PM.' },
    { q: 'What is your return policy?', a: 'We accept returns within 24 hours of delivery for freshness concerns. Please contact our support team to initiate a return.' },
    { q: 'Do you offer free delivery?', a: 'Yes! We offer free delivery on all orders over $50. Orders under $50 have a small delivery fee.' },
    { q: 'Are your products organic?', a: 'We offer both organic and conventional options. Look for the "organic" label on product pages.' },
    { q: 'How do I track my order?', a: 'You can track your order in the "My Orders" section of your account. You will also receive email updates.' },
    { q: 'What payment methods do you accept?', a: 'We accept cash, credit/debit cards, PayPal, and Apple Pay for your convenience.' }
  ];

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about FoodHub delivery, returns, payments, and more."
        url="/faq"
      />
      <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">❓</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500">Find answers to common questions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg divide-y divide-orange-100">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-orange-500">Q:</span> {faq.q}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed pl-6">
              <span className="text-orange-500 font-semibold">A:</span> {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">← Back to Store</Link>
      </div>
    </div>
    </>
  );
};

export default FAQ;
