import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white p-8 rounded-xl border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Login</h2>
          <p className="text-sm text-slate-500 mt-1">Welcome back to ShopHub</p>
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">Login</button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-500">
          <Link to="/forgot-password" className="text-blue-600 font-medium hover:text-blue-700">Forgot Password?</Link>
        </p>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>
            <div id="google-signin-button-login" className="flex justify-center"></div>
          </>
        )}
        <p className="text-center mt-6 text-sm text-slate-500">Don't have an account? <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
