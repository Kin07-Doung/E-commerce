import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import AddressForm from '../components/AddressForm';
import SEO from '../components/SEO';

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [saving, setSaving] = useState(false);

  const loadAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/user/addresses');
      setAddresses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [user, navigate]);

  const openAdd = () => {
    setModalMode('add');
    setModalInitial(null);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setModalMode('edit');
    setModalInitial(addr);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalInitial(null);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (modalMode === 'add') {
        await api.post('/user/addresses', data);
      } else {
        await api.put(`/user/addresses/${modalInitial.id}`, data);
      }
      closeModal();
      await loadAddresses();
      showSuccess(modalMode === 'add' ? 'Address added successfully' : 'Address updated successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      await loadAddresses();
      showSuccess('Default address updated');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update default address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      await loadAddresses();
      showSuccess('Address deleted');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading addresses…</p>
        </div>
      </div>
    );
  }

  const formatAddress = (a) => {
    const parts = [
      a.address_line1,
      a.address_line2,
      `${a.city}${a.state ? `, ${a.state}` : ''}`,
      a.postal_code,
      a.country,
    ];
    return parts.filter(Boolean).join(', ');
  };

  return (
    <>
      <SEO
        title="My Addresses"
        description="Manage your delivery addresses for fast and accurate delivery."
        url="/addresses"
        noIndex
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Delivery addresses
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage where your orders are delivered
              </p>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add address
            </button>
          </div>

          {error && (
            <div className="mb-6">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {/* Empty state */}
          {addresses.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">No addresses yet</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Add a delivery address so we can deliver your orders accurately.
              </p>
              <button
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`relative rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                    addr.is_default
                      ? 'border-orange-300 ring-1 ring-orange-100'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Default badge */}
                  {addr.is_default && (
                    <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                      Default
                    </span>
                  )}

                  {/* Content */}
                  <div className="pr-16">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{addr.name}</h3>
                      {addr.label && (
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {addr.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {formatAddress(addr)}
                    </p>
                    {addr.phone && (
                      <p className="mt-1.5 text-sm text-gray-500">{addr.phone}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(addr)}
                      className="text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link
              to="/profile"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to account
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalMode === 'add' ? 'Add delivery address' : 'Edit delivery address'}
      >
        <AddressForm
          initial={modalInitial}
          onSubmit={handleSave}
          onCancel={closeModal}
          disabled={saving}
        />
      </Modal>
    </>
  );
};

export default AddressBook;