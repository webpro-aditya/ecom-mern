import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-bold mb-4 inline-block">
              ECOM<span className="text-blue-400">PRO</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your premier destination for quality products. We curate the best items from around the world to bring you an exceptional shopping experience.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                📷
              </a>
              <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                🐦
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                📺
              </a>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-semibold mb-3">Payment Methods</h4>
              <div className="flex space-x-2">
                <div className="bg-gray-800 rounded px-3 py-2 text-xs font-semibold">VISA</div>
                <div className="bg-gray-800 rounded px-3 py-2 text-xs font-semibold">MC</div>
                <div className="bg-gray-800 rounded px-3 py-2 text-xs font-semibold">AMEX</div>
                <div className="bg-gray-800 rounded px-3 py-2 text-xs font-semibold">PayPal</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/sale" className="text-gray-300 hover:text-white transition-colors">Sale Items</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-300 hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="mr-3">📍</span>
                <span className="text-gray-300">123 Commerce St, City, State 12345</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">📞</span>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">✉️</span>
                <span className="text-gray-300">support@ecompro.com</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">🕒</span>
                <span className="text-gray-300">Mon-Fri: 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-300">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} EcomPro. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-300">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;