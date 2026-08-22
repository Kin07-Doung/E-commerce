import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
  const values = [
    {
      title: 'Free delivery',
      description: 'On orders over $50',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: 'Fresh guarantee',
      description: 'Quality ingredients, every order',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '24/7 support',
      description: 'Help whenever you need it',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="About Kin Shop"
        description="Learn about Kin Shop — fresh ingredients and delicious meals delivered to your door."
        url="/about"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              About Kin Shop
            </h1>
            <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto">
              Fresh food, thoughtfully sourced, delivered to your door.
            </p>
          </div>

          {/* Main content card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-8 sm:px-8 sm:py-10 space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Kin Shop is your one-stop shop for fresh, quality ingredients and
                delicious meals. We started with a simple mission: to bring the
                best of the culinary world right to your doorstep.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With thousands of happy customers, we pride ourselves on fresh
                ingredients, reliable delivery, and exceptional customer service.
                Our team works every day to ensure every order meets the highest
                standards.
              </p>
            </div>

            {/* Values / highlights */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-8 sm:px-8">
              <div className="grid gap-6 sm:grid-cols-3">
                {values.map((item) => (
                  <div key={item.title} className="text-center sm:text-left">
                    <div className="mx-auto sm:mx-0 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                      {item.icon}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
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

export default About;