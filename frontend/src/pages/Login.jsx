import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useRateLimit } from '../hooks/useRateLimit';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const { isRateLimited, retryAfter, handleError, clearRateLimit, RateLimitBanner } = useRateLimit();
  const navigate = useNavigate();

  const handleGoogleSignIn = async (credential) => {
    try {
      await googleSignIn(credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  useGoogleSignIn(handleGoogleSignIn, 'google-signin-button-login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = window.grecaptcha?.getResponse();
      if (!token) {
        setError('Please complete the reCAPTCHA');
        setLoading(false);
        return;
      }
      await login(email, password, token);
      clearRateLimit();
      navigate('/');
    } catch (err) {
      if (!handleError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your Kin Shop account to continue ordering."
        url="/login"
        noIndex
      />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Welcome back. Enter your details to continue.
              </p>
            </div>

             {/* Error */}
             {error && !isRateLimited && (
               <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                 {error}
               </div>
             )}
             <RateLimitBanner />

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-500">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div
                id="recaptcha-login"
                data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                className="g-recaptcha flex justify-center"
              />

              <button
                type="submit"
                disabled={loading || isRateLimited}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {(loading || isRateLimited) ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isRateLimited ? `Wait ${retryAfter}s` : 'Signing in…'}
                  </>
                ) : (
                  'Sign in'
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
                <div
                  id="google-signin-button-login"
                  className="flex justify-center"
                />
              </>
            )}

            {/* Register link */}
            <p className="mt-6 border-t border-gray-100 pt-5 text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure login · Your data is protected
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;