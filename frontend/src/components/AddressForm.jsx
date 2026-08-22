import React, { useState, useEffect } from 'react';

const AddressForm = ({ initial, onSubmit, onCancel, disabled, isLoading }) => {
  const [form, setForm] = useState(
    initial || {
      label: '',
      name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      is_default: false,
    }
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
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
      errors[fieldName]
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="label" className="mb-1.5 block text-xs font-medium text-gray-500">
          Label
        </label>
        <input
          id="label"
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Home, Work…"
          className={inputClasses('label')}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-gray-500">
          Full name <span className="text-red-500">*</span>
        </label>
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
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-gray-500">
          Phone <span className="text-red-500">*</span>
        </label>
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
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="address_line1" className="mb-1.5 block text-xs font-medium text-gray-500">
          Address line 1 <span className="text-red-500">*</span>
        </label>
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
        {errors.address_line1 && (
          <p className="mt-1 text-xs text-red-600">{errors.address_line1}</p>
        )}
      </div>

      <div>
        <label htmlFor="address_line2" className="mb-1.5 block text-xs font-medium text-gray-500">
          Address line 2
        </label>
        <input
          id="address_line2"
          type="text"
          name="address_line2"
          value={form.address_line2}
          onChange={handleChange}
          className={inputClasses('address_line2')}
          autoComplete="address-line2"
          placeholder="Apt, suite, unit, building, floor…"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="mb-1.5 block text-xs font-medium text-gray-500">
            City <span className="text-red-500">*</span>
          </label>
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
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="state" className="mb-1.5 block text-xs font-medium text-gray-500">
            State / Province
          </label>
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
          <label htmlFor="postal_code" className="mb-1.5 block text-xs font-medium text-gray-500">
            Postal code <span className="text-red-500">*</span>
          </label>
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
          {errors.postal_code && (
            <p className="mt-1 text-xs text-red-600">{errors.postal_code}</p>
          )}
        </div>
        <div>
          <label htmlFor="country" className="mb-1.5 block text-xs font-medium text-gray-500">
            Country <span className="text-red-500">*</span>
          </label>
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
          {errors.country && (
            <p className="mt-1 text-xs text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
        Set as default address
      </label>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled || isLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            'Save address'
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;