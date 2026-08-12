import React, { useState, useEffect } from 'react';

const AddressForm = ({ initial, onSubmit, onCancel, disabled, isLoading }) => {
  const [form, setForm] = useState(
    initial || { label: '', name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '', is_default: false }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setErrors({});
    }
  }, [initial]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!form.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    } else if (!/^[\d\w\s-]{3,10}$/.test(form.postal_code.trim())) {
      newErrors.postal_code = 'Enter a valid postal code';
    }
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const inputClasses = (fieldName) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
      errors[fieldName] ? 'border-red-300 bg-red-50' : 'border-slate-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="label" className="block text-xs font-medium text-slate-500 mb-1.5">Label</label>
        <input
          id="label"
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Home, Work..."
          className={inputClasses('label')}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClasses('name')}
          autoComplete="name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={inputClasses('phone')}
          autoComplete="tel"
          placeholder="+1 234 567 8900"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="address_line1" className="block text-xs font-medium text-slate-500 mb-1.5">Address Line 1</label>
        <input
          id="address_line1"
          type="text"
          name="address_line1"
          value={form.address_line1}
          onChange={handleChange}
          required
          className={inputClasses('address_line1')}
          autoComplete="address-line1"
        />
        {errors.address_line1 && <p className="mt-1 text-xs text-red-500">{errors.address_line1}</p>}
      </div>
      <div>
        <label htmlFor="address_line2" className="block text-xs font-medium text-slate-500 mb-1.5">Address Line 2</label>
        <input
          id="address_line2"
          type="text"
          name="address_line2"
          value={form.address_line2}
          onChange={handleChange}
          className={inputClasses('address_line2')}
          autoComplete="address-line2"
          placeholder="Apt, suite, unit, building, floor, etc."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1.5">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className={inputClasses('city')}
            autoComplete="address-level2"
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-xs font-medium text-slate-500 mb-1.5">State / Province</label>
          <input
            id="state"
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            className={inputClasses('state')}
            autoComplete="address-level1"
          />
        </div>
        <div>
          <label htmlFor="postal_code" className="block text-xs font-medium text-slate-500 mb-1.5">Postal Code</label>
          <input
            id="postal_code"
            type="text"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            required
            className={inputClasses('postal_code')}
            autoComplete="postal-code"
          />
          {errors.postal_code && <p className="mt-1 text-xs text-red-500">{errors.postal_code}</p>}
        </div>
        <div>
          <label htmlFor="country" className="block text-xs font-medium text-slate-500 mb-1.5">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            className={inputClasses('country')}
            autoComplete="country"
          />
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-slate-700">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
        />
        Set as default address
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled || isLoading}
          className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled || isLoading}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg shadow-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
