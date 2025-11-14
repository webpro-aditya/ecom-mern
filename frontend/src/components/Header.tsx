import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggleButton } from "./common/ThemeToggleButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = 3; // Example cart count

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 text-sm dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">
              📞 +1 (555) 123-4567
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              ✉️ support@ecompro.com
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/track-order"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/help"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Help
            </Link>
            <ThemeToggleButton />
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-gray-800 hover:text-gray-600 transition-colors dark:text-white dark:hover:text-gray-300"
          >
            ECOM<span className="text-blue-600 dark:text-blue-400">PRO</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full items-stretch">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full h-11 pl-11 pr-4 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button className="h-11 bg-blue-600 text-white px-6 rounded-r-full hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400">
                Search
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link
              to="/wishlist"
              className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors dark:text-gray-300 dark:hover:text-white"
            >
              <span className="text-xl">♥️</span>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors relative dark:text-gray-300 dark:hover:text-white"
            >
              <span className="text-xl">🛒</span>
              <span className="text-xs mt-1">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/account"
              className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition-colors dark:text-gray-300 dark:hover:text-white"
            >
              <span className="text-xl">👤</span>
              <span className="text-xs mt-1">Account</span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100 py-3 dark:border-gray-800">
          <ul className="flex items-center justify-center space-x-8 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/categories/electronics"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/categories/fashion"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Fashion
              </Link>
            </li>
            <li>
              <Link
                to="/categories/home"
                className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-white"
              >
                Home & Living
              </Link>
            </li>
            <li>
              <Link
                to="/sale"
                className="text-red-600 hover:text-red-700 font-bold transition-colors dark:text-red-400 dark:hover:text-red-300"
              >
                🔥 Sale
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
