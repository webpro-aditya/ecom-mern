import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RootState, AppDispatch } from "../store";
import { logout as logoutAction } from "../store/userSlice";
import { ThemeToggleButton } from "./common/ThemeToggleButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const cartItemCount = 3;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
      const csrfToken = match ? decodeURIComponent(match[1]) : "";
      await axios.post(
        `${import.meta.env.VITE_API_URL}auth/logout`,
        {},
        { withCredentials: true, headers: { "X-CSRF-Token": csrfToken } }
      );
    } catch (error) {}
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    setIsAccountOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto px-4">

        {/* -------- TOP BAR -------- */}
        <div className="hidden md:flex items-center justify-between py-3 border-b border-gray-100 text-sm dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">📞 +1 (555) 123-4567</span>
            <span className="text-gray-600 dark:text-gray-300">✉️ support@ecompro.com</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/track-order" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              Track Order
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              Help
            </Link>
            <ThemeToggleButton />
          </div>
        </div>

        {/* -------- MAIN HEADER -------- */}
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-gray-800 dark:text-white">
            ECOM<span className="text-blue-600 dark:text-blue-400">PRO</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-11 pl-11 pr-4 border border-gray-300 rounded-l-full focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button className="h-11 bg-blue-600 text-white px-6 rounded-r-full dark:bg-blue-500">
                Search
              </button>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="flex flex-col items-center text-gray-600 dark:text-gray-300">
              <span className="text-xl">♥️</span>
              <span className="text-xs mt-1">Wishlist</span>
            </Link>

            <Link to="/cart" className="relative flex flex-col items-center text-gray-600 dark:text-gray-300">
              <span className="text-xl">🛒</span>
              <span className="text-xs mt-1">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex flex-col items-center text-gray-600 dark:text-gray-300"
              >
                <span className="text-xl">👤</span>
                <span className="text-xs mt-1">Account</span>
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-200 bg-white shadow-lg p-2 dark:bg-gray-900 dark:border-gray-800">
                  {user ? (
                    <div className="flex flex-col text-sm">
                      <Link to="/account/dashboard" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
                      <Link to="/account/orders" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Orders</Link>
                      <Link to="/account/address" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Addresses</Link>
                      <Link to="/account/profile" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Profile</Link>
                      <button onClick={handleLogout} className="mt-1 px-3 py-2 rounded text-left text-red-600 hover:bg-red-50 dark:hover:bg-gray-800">Logout</button>
                    </div>
                  ) : (
                    <div className="flex flex-col text-sm">
                      <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Login</Link>
                      <Link to="/register" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Register</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖️" : "☰"}
          </button>
        </div>

        {/* -------- MOBILE MENU -------- */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">

            {/* Mobile Search */}
            <div className="flex w-full mb-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-11 pl-11 pr-4 border border-gray-300 rounded-l-full dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button className="h-11 bg-blue-600 text-white px-6 rounded-r-full">
                Go
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex justify-around text-center py-3 border-t border-gray-200 dark:border-gray-800">
              <Link to="/wishlist" className="flex flex-col items-center">
                <span className="text-xl">♥️</span>
                <span className="text-xs">Wishlist</span>
              </Link>

              <Link to="/cart" className="relative flex flex-col items-center">
                <span className="text-xl">🛒</span>
                <span className="text-xs">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex flex-col items-center">
                  <span className="text-xl">👤</span>
                  <span className="text-xs">Account</span>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center">
                  <span className="text-xl">👤</span>
                  <span className="text-xs">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li><Link to="/" className="block py-2">Home</Link></li>
              <li><Link to="/products" className="block py-2">All Products</Link></li>
              <li><Link to="/categories/electronics" className="block py-2">Electronics</Link></li>
              <li><Link to="/categories/fashion" className="block py-2">Fashion</Link></li>
              <li><Link to="/categories/home" className="block py-2">Home & Living</Link></li>
              <li><Link to="/sale" className="text-red-600 block py-2">🔥 Sale</Link></li>
              {user ? (
                <>
                  <li><Link to="/account/dashboard" className="block py-2">Account Dashboard</Link></li>
                  <li><Link to="/account/orders" className="block py-2">My Orders</Link></li>
                  <li><Link to="/account/address" className="block py-2">My Addresses</Link></li>
                  <li><Link to="/account/profile" className="block py-2">Profile</Link></li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="block py-2">Login</Link></li>
                  <li><Link to="/register" className="block py-2">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* -------- DESKTOP NAV -------- */}
        <nav className="hidden md:block border-t border-gray-100 py-3 dark:border-gray-800">
          <ul className="flex items-center justify-center space-x-8 text-sm font-medium">
            <li><Link to="/" className="hover:text-blue-600 dark:hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-600 dark:hover:text-white">All Products</Link></li>
            <li><Link to="/categories/electronics" className="hover:text-blue-600 dark:hover:text-white">Electronics</Link></li>
            <li><Link to="/categories/fashion" className="hover:text-blue-600 dark:hover:text-white">Fashion</Link></li>
            <li><Link to="/categories/home" className="hover:text-blue-600 dark:hover:text-white">Home & Living</Link></li>
            <li><Link to="/sale" className="text-red-600 font-bold dark:text-red-400">🔥 Sale</Link></li>
          </ul>
        </nav>

      </div>
    </header>
  );
};

export default Header;
