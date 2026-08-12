import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
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
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Welcome back to FoodHub. Sign in to continue ordering delicious fresh food."
        url="/login"
        noIndex
      />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 w-full max-w-md shadow-xl">
         {/* Header */}
         <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mb-4 shadow-lg">
             <span className="text-4xl">🍽️</span>
           </div>
           <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
           <p className="text-sm text-gray-500 mt-2 font-handwritten text-lg text-orange-500">
             We missed you — come on in
           </p>
         </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              <span>🔒</span> Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
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
                Logging in...
              </>
            ) : (
              <>
                <span>🍽️</span> Login
              </>
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-center mt-3 text-sm">
          <Link to="/forgot-password" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
            Forgot Password?
          </Link>
        </p>

        {/* Google Sign In */}
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-orange-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div id="google-signin-button-login" className="flex justify-center"></div>
          </>
        )}

        {/* Register Link */}
        <p className="text-center mt-6 pt-4 border-t-2 border-orange-100 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
            Create Account
          </Link>
        </p>

        {/* Trust Badge */}
        <div className="mt-4 flex justify-center items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">🔒 Secure Login</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">🍽️ FoodHub</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">⭐ Fresh Guarantee</span>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;