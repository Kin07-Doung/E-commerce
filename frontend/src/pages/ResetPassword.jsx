import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Reset token is missing');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Reset token is missing');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setMessage('Password reset successful. Redirecting to login…');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password"
        description="Enter your new password to regain access to your Kin Shop account."
        url="/reset-password"
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
                Reset password
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter a new password for your account
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
            {!token && !error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Invalid or missing reset token. Please request a new password reset link.
              </div>
            )}

            {/* Form */}
            {token && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    New password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {/* Live requirements */}
                <ul className="space-y-1 text-xs text-gray-500">
                  <li
                    className={
                      password.length >= 6 ? 'text-emerald-600' : ''
                    }
                  >
                    {password.length >= 6 ? '✓' : '○'} At least 6 characters
                  </li>
                  <li
                    className={
                      password === confirmPassword && password.length > 0
                        ? 'text-emerald-600'
                        : ''
                    }
                  >
                    {password === confirmPassword && password.length > 0
                      ? '✓'
                      : '○'}{' '}
                    Passwords match
                  </li>
                </ul>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Resetting…
                    </>
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>
            )}

            {/* Footer links */}
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-center">
              <Link
                to="/login"
                className="block text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
              >
                ← Back to login
              </Link>
              {!token && (
                <Link
                  to="/forgot-password"
                  className="block text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Request a new reset link
                </Link>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure reset · Link expires in 1 hour
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;