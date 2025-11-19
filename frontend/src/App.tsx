import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "./store";
import { fetchUser } from "./store/userSlice";
import { AuthProvider } from "./context/AuthContext";

import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/protect/ProtectedRoute";

// Dashboard Layout
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";

import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";

// UI Layout
import MainLayout from "./layout/MainLayout";

// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

// UI Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/ui/LoginPage";
import RegisterPage from "./pages/ui/RegisterPage";
import CartPage from "./pages/ui/CartPage";
import WishlistPage from "./pages/ui/WishlistPage";
import CategoriesPage from "./pages/ui/CategoriesPage";
import FAQsPage from "./pages/ui/FAQsPage";
import SalePage from "./pages/ui/SalePage";
import NewArrivalsPage from "./pages/ui/NewArrivalsPage";
import CategoryProductsPage from "./pages/ui/CategoryProductsPage";
import ProductDetailsPage from "./pages/ui/ProductDetailsPage";
import ContactUsPage from "./pages/ui/ContactUsPage";
import PrivacyPolicyPage from "./pages/ui/PrivacyPolicyPage";
import ReturnPolicyPage from "./pages/ui/ReturnPolicyPage";
import ShippingPolicyPage from "./pages/ui/ShippingPolicyPage";
import TermsConditionsPage from "./pages/ui/TermsConditionsPage";
import AccountAddressesPage from "./pages/ui/AccountAddressesPage";
import AccountDashboardPage from "./pages/ui/AccountDashboardPage";
import AccountOrdersPage from "./pages/ui/AccountOrdersPage";
import AccountProfilePage from "./pages/ui/AccountProfilePage";

// Admin: Users
import UsersList from "./pages/Users/UsersList";
import UserAdd from "./pages/Users/UserAdd";
import UserEdit from "./pages/Users/UserEdit";

// Admin: Banners
import BannersList from "./pages/Banners/BannersList";
import BannerAdd from "./pages/Banners/BannerAdd";
import BannerEdit from "./pages/Banners/BannerEdit";

// Admin: Categories
import CategoriesList from "./pages/Categories/CategoriesList";
import CategoryAdd from "./pages/Categories/CategoryAdd";
import CategoryEdit from "./pages/Categories/CategoryEdit";

// Admin: Brands
import BrandsList from "./pages/Brands/BrandsList";
import BrandAdd from "./pages/Brands/BrandAdd";
import BrandEdit from "./pages/Brands/BrandEdit";

// Admin: Products
import ProductsList from "./pages/Products/ProductsList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";

// Admin: Orders
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";

// Admin: Social Links
import SocialLinksManager from "./pages/SocialLinks/SocialLinksManager";

/* -----------------------------------
   AppInit - fetch user once
------------------------------------ */
function AppInit() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}csrf-token`, {
      credentials: "include",
    }).catch(() => {});

    dispatch(fetchUser());
  }, [dispatch]);

  return null;
}

/* -----------------------------------
   Main Application
------------------------------------ */
export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AppInit />
          <ScrollToTop />

          <Routes>
            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Home />} />

              {/* Users */}
              <Route path="users" element={<UsersList />} />
              <Route path="users/add" element={<UserAdd />} />
              <Route path="users/:id/edit" element={<UserEdit />} />

              {/* Banners */}
              <Route path="banners" element={<BannersList />} />
              <Route path="banners/add" element={<BannerAdd />} />
              <Route path="banners/:id/edit" element={<BannerEdit />} />

              {/* Categories */}
              <Route path="categories" element={<CategoriesList />} />
              <Route path="categories/add" element={<CategoryAdd />} />
              <Route path="categories/:id/edit" element={<CategoryEdit />} />

              {/* Brands */}
              <Route path="brands" element={<BrandsList />} />
              <Route path="brands/add" element={<BrandAdd />} />
              <Route path="brands/:id/edit" element={<BrandEdit />} />

              {/* Products */}
              <Route path="products" element={<ProductsList />} />
              <Route path="products/add" element={<ProductAdd />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />

              {/* Orders */}
              <Route path="orders" element={<OrdersList />} />
              <Route path="order/:id" element={<OrderDetails />} />

              {/* Social Links */}
              <Route path="social-links" element={<SocialLinksManager />} />

              {/* Misc */}
              <Route path="profile" element={<UserProfiles />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="blank" element={<Blank />} />
            </Route>

            {/* AUTH ROUTES */}
            <Route path="/admin/signin" element={<SignIn />} />
            <Route path="/admin/signup" element={<SignUp />} />

            {/* UI ROUTES */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              <Route path="/categories" element={<CategoriesPage />} />
              <Route
                path="/category/:slug"
                element={<CategoryProductsPage />}
              />
              <Route path="/product/:id" element={<ProductDetailsPage />} />

              <Route path="/faq" element={<FAQsPage />} />
              <Route path="/sale" element={<SalePage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />

              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsConditionsPage />}
              />

              {/* ACCOUNT ROUTES GROUPED */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <Outlet />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AccountDashboardPage />} />
                <Route path="orders" element={<AccountOrdersPage />} />
                <Route path="address" element={<AccountAddressesPage />} />
                <Route path="profile" element={<AccountProfilePage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
}
