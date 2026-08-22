import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import SEO from '../components/SEO';

const Settings = () => {
  const { updateProfile, updatePassword } = useAuth();
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
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || '',
        });
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
      setFormSuccess('Profile updated successfully');
      showSuccess('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setFormError(msg);
      showError(msg);
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
      setPwdMessage({
        type: 'success',
        text: res.message || 'Password updated successfully',
      });
      setPwdForm({ currentPassword: '', newPassword: '' });
      showSuccess('Password updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      setPwdMessage({ type: 'error', text: msg });
      showError(msg);
    } finally {
      setPwdSaving(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Account Settings"
        description="Update your personal information and password."
        url="/settings"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Account settings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal information and security
              </p>
            </div>
            <Link
              to="/profile"
              className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
            >
              ← Back to account
            </Link>
          </div>

          {/* Personal information */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 mb-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                {getInitials(form.name)}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Personal information
                </h2>
                <p className="text-xs text-gray-500">Update your name, email, and phone</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleProfileChange}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </form>
          </div>

          {/* Change password */}
          {profile?.provider === 'email' && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 mb-6">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-gray-900">
                  Change password
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Update the password for your account
                </p>
              </div>

              {pwdMessage.text && (
                <div
                  className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                    pwdMessage.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {pwdMessage.text}
                </div>
              )}

              <form onSubmit={handlePwdSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={pwdForm.currentPassword}
                    onChange={handlePwdChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    New password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={pwdForm.newPassword}
                    onChange={handlePwdChange}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 6 characters
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {pwdSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating…
                    </>
                  ) : (
                    'Update password'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Security note */}
          <p className="text-center text-xs text-gray-400">
            Use a strong password and never share it. Your connection is secure.
          </p>
        </div>
      </div>
    </>
  );
};

export default Settings;