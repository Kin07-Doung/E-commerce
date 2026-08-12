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

  const openAdd = () => { setModalMode('add'); setModalInitial(null); setModalOpen(true); };
  const openEdit = (addr) => { setModalMode('edit'); setModalInitial(addr); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setModalInitial(null); };

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
      showSuccess(modalMode === 'add' ? '📍 Address added successfully!' : '📍 Address updated successfully!');
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
      showSuccess('⭐ Default address updated!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update default address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('🗑️ Delete this address?')) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      await loadAddresses();
      showSuccess('🗑️ Address deleted');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete address');
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="container py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-orange-600 font-medium">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  const formatAddress = (a) => {
    const parts = [a.address_line1, a.address_line2, `${a.city}${a.state ? `, ${a.state}` : ''}`, a.postal_code, a.country];
    return parts.filter(Boolean).join('\n');
  };

  return (
    <>
      <SEO
        title="My Addresses"
        description="Manage your delivery addresses for fast and accurate food delivery."
        url="/addresses"
      />
      <div className="space-y-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Delivery Addresses</h2>
            <p className="text-sm text-gray-500">Manage where your food gets delivered</p>
          </div>
        </div>
        <button 
          onClick={openAdd} 
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Address
        </button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-12 text-center shadow-lg">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Addresses Saved</h3>
          <p className="text-gray-500 mb-6">Add your first delivery address to start ordering food</p>
          <button 
            onClick={openAdd} 
            className="text-orange-600 font-medium hover:text-orange-700 transition-colors inline-flex items-center gap-2"
          >
            <span>Add your first address</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`group relative bg-white rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                addr.is_default 
                  ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-md shadow-orange-100' 
                  : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              {/* Default Badge */}
              {addr.is_default && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    ⭐ Default
                  </span>
                </div>
              )}

              {/* Address Content */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{addr.name}</h4>
                    {addr.label && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1">
                        <span>🏷️</span>
                        {addr.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="bg-white/60 rounded-xl p-3 border border-orange-100/50">
                  <pre className="text-sm text-gray-600 whitespace-pre-line font-sans leading-relaxed">
                    {formatAddress(addr)}
                  </pre>
                  {addr.phone && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <span>📱</span>
                      {addr.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-orange-100">
                {!addr.is_default && (
                  <button 
                    onClick={() => handleSetDefault(addr.id)} 
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>⭐</span> Set as default
                  </button>
                )}
                <button 
                  onClick={() => openEdit(addr)} 
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(addr.id)} 
                  className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Profile */}
      <div className="pt-4">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </Link>
      </div>

      {/* Address Form Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={
          <div className="flex items-center gap-3">
            <span className="text-2xl">{modalMode === 'add' ? '📍' : '✏️'}</span>
            <span className="text-xl font-bold text-gray-800">
              {modalMode === 'add' ? 'Add New Delivery Address' : 'Edit Delivery Address'}
            </span>
          </div>
        }
      >
        <AddressForm 
          initial={modalInitial} 
          onSubmit={handleSave} 
          onCancel={closeModal} 
          disabled={saving} 
        />
      </Modal>
    </div>
    </>
  );
};

export default AddressBook;