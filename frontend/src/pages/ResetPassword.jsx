import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

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
      setMessage('✅ Password reset successful!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mb-4 shadow-lg">
            <span className="text-4xl">🔑</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your new password to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>✅</span>
            <span>{message}</span>
          </div>
        )}

        {/* Invalid Token */}
        {!token && !error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>❌</span>
            <span>Invalid or missing reset token. Please request a new password reset link.</span>
          </div>
        )}

        {/* Reset Form */}
        {token && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>🔒</span> New Password
              </label>
              <input 
                type="password" 
                placeholder="Create a new password (min 6 chars)" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>✓</span> Confirm Password
              </label>
              <input 
                type="password" 
                placeholder="Confirm your new password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                minLength={6} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-500">Password must:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li className={password.length >= 6 ? 'text-green-600' : ''}>
                  {password.length >= 6 ? '✅' : '○'} Be at least 6 characters
                </li>
                <li className={password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}>
                  {password === confirmPassword && password.length > 0 ? '✅' : '○'} Match confirmation
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <span>🔑</span> Reset Password
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 pt-4 border-t-2 border-orange-100">
          <button 
            onClick={handleBackToLogin}
            className="w-full text-center text-sm text-gray-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-1"
          >
            <span>←</span> Back to Login
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
          <p className="text-xs text-gray-600 text-center">
            💡 Having trouble?{' '}
            <Link to="/forgot-password" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              Request a new reset link
            </Link>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>🔒</span> Secure password reset
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>⏱️</span> Link expires in 1 hour
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;