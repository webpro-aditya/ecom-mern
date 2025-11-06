import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = 3; // Example cart count

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">📞 +1 (555) 123-4567</span>
            <span className="text-gray-600">✉️ support@ecompro.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/track-order" className="text-gray-600 hover:text-gray-800">Track Order</Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-800">Help</Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            ECOM<span className="text-blue-600">PRO</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full items-stretch">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full h-11 pl-11 pr-4 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="h-11 bg-blue-600 text-white px-6 rounded-r-full hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors">
              <span className="text-xl">♥️</span>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors relative">
              <span className="text-xl">🛒</span>
              <span className="text-xs mt-1">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link to="/account" className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-xs mt-1">Account</span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100 py-3">
          <ul className="flex items-center justify-center space-x-8 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">All Products</Link></li>
            <li><Link to="/categories/electronics" className="text-gray-700 hover:text-blue-600 transition-colors">Electronics</Link></li>
            <li><Link to="/categories/fashion" className="text-gray-700 hover:text-blue-600 transition-colors">Fashion</Link></li>
            <li><Link to="/categories/home" className="text-gray-700 hover:text-blue-600 transition-colors">Home & Living</Link></li>
            <li><Link to="/sale" className="text-red-600 hover:text-red-700 font-bold transition-colors">🔥 Sale</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;