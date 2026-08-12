import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-900 via-amber-900 to-orange-900 text-white pt-12 pb-6">
      {/* Main Footer */}
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-orange-700/50">
          
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span className="text-orange-400">🍽️</span>
              <span className="text-orange-400">Food</span>
              <span className="text-amber-400">Hub</span>
            </Link>
            <p className="text-orange-200/80 text-sm leading-relaxed mb-4">
              Fresh, quality ingredients delivered to your doorstep. 
              Your one-stop shop for all your culinary needs.
            </p>
            <div className="flex gap-3">
              <span className="w-9 h-9 rounded-full bg-orange-800/50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                 </svg>
               </span>
               <span className="w-9 h-9 rounded-full bg-orange-800/50 flex items-center justify-center transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
               </span>
               <span className="w-9 h-9 rounded-full bg-orange-800/50 flex items-center justify-center transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                 </svg>
               </span>
               <span className="w-9 h-9 rounded-full bg-orange-800/50 flex items-center justify-center transition-colors">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
               </span>
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=fresh" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Fresh Deals
                </Link>
              </li>
              <li>
                <Link to="/products?category=organic" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Organic Selection
                </Link>
              </li>
              <li>
                <Link to="/products?category=seasonal" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Seasonal Specials
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wider mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/contact" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-orange-200/80 hover:text-orange-400 text-sm transition-colors">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-orange-400 font-semibold text-sm uppercase tracking-wider mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-orange-200/80">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Food Street,<br />Culinary City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-orange-200/80">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-orange-200/80">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@foodhub.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-orange-200/80">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon-Sat: 8:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

         {/* Bottom Bar */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
           <div className="text-sm text-orange-200/60">
             © {new Date().getFullYear()} FoodHub. All rights reserved. 
             <span className="hidden md:inline mx-2">|</span>
             <span className="block md:inline text-xs font-handwritten text-orange-300 text-base">
               Handcrafted with real love by real people
             </span>
           </div>
           
           <div className="flex items-center gap-3">
             <span className="stamp stamp-orange hidden sm:inline-block">No AI</span>
             <span className="text-xs text-orange-200/60 uppercase tracking-wider">Secure Payments</span>
             <div className="flex gap-2">
               <span className="px-2 py-1 bg-white/10 rounded text-xs text-orange-200/80">Visa</span>
               <span className="px-2 py-1 bg-white/10 rounded text-xs text-orange-200/80">Mastercard</span>
               <span className="px-2 py-1 bg-white/10 rounded text-xs text-orange-200/80">PayPal</span>
               <span className="px-2 py-1 bg-white/10 rounded text-xs text-orange-200/80">Apple Pay</span>
             </div>
           </div>
         </div>

         {/* Trust Badges */}
         <div className="mt-6 pt-6 border-t border-orange-700/30">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="flex items-center gap-2 text-orange-200/60 text-xs">
               <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span>100% Fresh Guarantee</span>
             </div>
             <div className="flex items-center gap-2 text-orange-200/60 text-xs">
               <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span>Free Delivery Over $50</span>
             </div>
             <div className="flex items-center gap-2 text-orange-200/60 text-xs">
               <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span>24/7 Support Available</span>
             </div>
             <div className="flex items-center gap-2 text-orange-200/60 text-xs">
               <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
               </svg>
               <span>Secure Checkout</span>
             </div>
           </div>
         </div>

         {/* Human Badge */}
         <div className="mt-6 pt-4 border-t border-orange-700/30 text-center">
           <span className="font-handwritten text-orange-300 text-xl">
             Proudly human-made. No robots were used in making this food.
           </span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;