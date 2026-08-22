import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Returns = () => {
  const sections = [
    {
      title: 'Return window',
      description:
        'We accept returns within 24 hours of delivery for freshness or quality concerns.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'How to return',
      description:
        'Contact our support team with your order number and reason for return. We will arrange a collection or provide a refund.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: 'Refunds',
      description:
        'Refunds are processed within 3–5 business days after we receive the returned items.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      title: 'Non-returnable items',
      description:
        'Perishable goods that have been opened or consumed cannot be returned unless they arrived damaged or defective.',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="Returns Policy"
        description="Easy returns for your peace of mind. 24-hour return window for freshness concerns."
        url="/returns"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Returns policy
            </h1>
            <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto">
              Easy returns for your peace of mind
            </p>
          </div>

          {/* Policy sections */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {sections.map((item) => (
                <li key={item.title} className="flex gap-4 p-5 sm:p-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Help CTA */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              Need to start a return?
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

export default Returns;