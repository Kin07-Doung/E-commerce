import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <span className="text-2xl">📞</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
            <p className="text-sm text-gray-500">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold text-gray-800">Address</p>
                <p className="text-sm text-gray-600">123 Food Street, Culinary City, FC 12345</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-sm text-gray-600">support@foodhub.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <p className="font-semibold text-gray-800">Hours</p>
                <p className="text-sm text-gray-600">Mon-Sat: 8:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Send us a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Name</label>
              <input type="text" className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Message</label>
              <textarea rows="4" className="w-full px-4 py-2.5 bg-orange-50/50 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 resize-y"></textarea>
            </div>
            <button type="button" onClick={() => alert('Thank you for contacting us! We will get back to you soon.')} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">← Back to Store</Link>
      </div>
    </div>
  );
};

export default Contact;
