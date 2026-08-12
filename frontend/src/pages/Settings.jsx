import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Alert from '../components/ui/Alert';
import SEO from '../components/SEO';

const Settings = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useAlert();

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
        setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [showError]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSaving(true);
    try {
      const updated = await updateProfile(form.name, form.email, form.phone || null);
      setProfile(updated);
      setFormSuccess('✅ Profile updated successfully');
      showSuccess('✅ Profile updated successfully');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update profile');
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdMessage({ type: '', text: '' });
    setPwdSaving(true);
    try {
      const res = await updatePassword(pwdForm.currentPassword, pwdForm.newPassword);
      setPwdMessage({ type: 'success', text: '✅ ' + (res.message || 'Password updated successfully') });
      setPwdForm({ currentPassword: '', newPassword: '' });
      showSuccess('🔑 Password updated successfully');
    } catch (err) {
      setPwdMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Account Settings"
        description="Update your personal information, change your password, and manage account security."
        url="/settings"
      />
      <div className="container py-8 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            <p className="text-sm text-gray-500">Manage your account preferences</p>
          </div>
        </div>
        <Link to="/profile" className="text-sm text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Profile
        </Link>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {getInitials(form.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            <p className="text-xs text-gray-400">Update your personal details</p>
          </div>
        </div>
        
        {formError && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>❌</span>
            <span>{formError}</span>
          </div>
        )}
        {formSuccess && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
            <span>✅</span>
            <span>{formSuccess}</span>
          </div>
        )}
        
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 max-w-lg">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              <span>👤</span> Full Name
            </label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleProfileChange} 
              required 
              className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              <span>📧</span> Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleProfileChange} 
              required 
              className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              <span>📱</span> Phone Number
            </label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone} 
              onChange={handleProfileChange} 
              className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
          <button 
            type="submit" 
            disabled={saving} 
            className="self-start bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Change Password */}
      {profile?.provider === 'email' && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-100">
            <span className="text-2xl">🔑</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
          </div>
          
          {pwdMessage.text && (
            <div className={`border-2 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2 ${
              pwdMessage.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <span>{pwdMessage.type === 'success' ? '✅' : '❌'}</span>
              <span>{pwdMessage.text}</span>
            </div>
          )}
          
          <form onSubmit={handlePwdSubmit} className="flex flex-col gap-4 max-w-lg">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>🔒</span> Current Password
              </label>
              <input 
                type="password" 
                name="currentPassword" 
                value={pwdForm.currentPassword} 
                onChange={handlePwdChange} 
                required 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                <span>✨</span> New Password
              </label>
              <input 
                type="password" 
                name="newPassword" 
                value={pwdForm.newPassword} 
                onChange={handlePwdChange} 
                required 
                minLength={6} 
                className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                placeholder="Enter a new password (min 6 chars)"
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
            </div>
            <button 
              type="submit" 
              disabled={pwdSaving} 
              className="self-start bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {pwdSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  🔑 Update Password
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Security Tips</h4>
            <ul className="text-xs text-gray-500 mt-1 space-y-1">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Never share your password with anyone</li>
              <li>• Update your password regularly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">🔒 Secure Connection</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="flex items-center gap-1">🛡️ Privacy Protected</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">⭐ Verified Account</span>
        </div>
      </div>
    </>
  );
};

export default Settings;

 Settings;


