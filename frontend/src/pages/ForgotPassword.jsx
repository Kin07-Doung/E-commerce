import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mb-4 shadow-lg">
            <span className="text-4xl">🔑</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>✅</span>
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              <span>📧</span> Email Address
            </label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 placeholder:text-gray-400"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span>📨</span> Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t-2 border-orange-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors flex items-center gap-1">
            <span>←</span> Back to Login
          </Link>
          <Link to="/register" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
            Create an account
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>🔒</span> Secure password reset
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>⏱️</span> 24/7 support
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;