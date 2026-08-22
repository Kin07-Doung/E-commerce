import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import SEO from '../components/SEO';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async (credential) => {
    try {
      await googleSignIn(credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  useGoogleSignIn(handleGoogleSignIn, 'google-signin-button');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Create Account"
        description="Join Kin Shop and start ordering. Free delivery on orders over $50."
        url="/register"
        noIndex
      />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Create account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Join Kin Shop to order fresh food and track deliveries
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
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
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Password
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
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 6 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Google sign-in */}
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div id="google-signin-button" className="flex justify-center" />
              </>
            )}

            {/* Login link */}
            <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Free to join · Secure registration · Your data is protected
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;