import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password"
        description="Reset your Kin Shop account password. Enter your email to receive a secure reset link."
        url="/forgot-password"
        noIndex
      />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter your email and we’ll send you a reset link
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 flex flex-col items-center gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
              >
                ← Back to login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure password reset · We never share your email
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;