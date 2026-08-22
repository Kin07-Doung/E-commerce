import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 1–2 business days. Express delivery is available for same-day orders placed before 2 PM.',
    },
    {
      q: 'What is your return policy?',
      a: 'We accept returns within 24 hours of delivery for freshness concerns. Please contact our support team to initiate a return.',
    },
    {
      q: 'Do you offer free delivery?',
      a: 'Yes. We offer free delivery on all orders over $50. Orders under $50 have a small delivery fee.',
    },
    {
      q: 'Are your products organic?',
      a: 'We offer both organic and conventional options. Look for the “organic” label on product pages.',
    },
    {
      q: 'How do I track my order?',
      a: 'You can track your order in the “My Orders” section of your account. You will also receive email updates.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept cash, credit/debit cards, PayPal, and Apple Pay for your convenience.',
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Kin Shop delivery, returns, payments, and more."
        url="/faq"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Frequently asked questions
            </h1>
            <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto">
              Quick answers to the most common questions about orders, delivery, and more.
            </p>
          </div>

          {/* Accordion */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {faq.q}
                      </span>
                      <svg
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Help CTA */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              Still have questions?
            </p>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              Contact support
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
            >
              <svg
                className="mr-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to store
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;