import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState, AppDispatch } from "./store";
import { fetchUser } from "./store/userSlice";
import { AuthProvider } from "./context/AuthContext";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/protect/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

// UI Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/ui/LoginPage";
import RegisterPage from "./pages/ui/RegisterPage";
import CartPage from "./pages/ui/CartPage";
import WishlistPage from "./pages/ui/WishlistPage";
import ContactUsPage from "./pages/ui/ContactUsPage";
import CategoriesPage from "./pages/ui/CategoriesPage";
import FAQsPage from "./pages/ui/FAQsPage";
import SalePage from "./pages/ui/SalePage";
import NewArrivalsPage from "./pages/ui/NewArrivalsPage";
import PrivacyPolicyPage from "./pages/ui/PrivacyPolicyPage";
import ReturnPolicyPage from "./pages/ui/ReturnPolicyPage";
import ShippingPolicyPage from "./pages/ui/ShippingPolicyPage";
import TermsConditionsPage from "./pages/ui/TermsConditionsPage";


// Users
import UsersList from "./pages/Users/UsersList";
import UserAdd from "./pages/Users/UserAdd";
import UserEdit from "./pages/Users/UserEdit";

// Banners
import BannersList from "./pages/Banners/BannersList";
import BannerAdd from "./pages/Banners/BannerAdd";
import BannerEdit from "./pages/Banners/BannerEdit";

// Categories
import CategoriesList from "./pages/Categories/CategoriesList";
import CategoryAdd from "./pages/Categories/CategoryAdd";
import CategoryEdit from "./pages/Categories/CategoryEdit";

// Brands
import BrandsList from "./pages/Brands/BrandsList";
import BrandAdd from "./pages/Brands/BrandAdd";
import BrandEdit from "./pages/Brands/BrandEdit";

// Products
import ProductsList from "./pages/Products/ProductsList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";

// Orders
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";

import SocialLinksManager from "./pages/SocialLinks/SocialLinksManager";

function AppInit() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppInit />
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AuthProvider>
                  <AppLayout />
                </AuthProvider>
              </ProtectedRoute>
            }
          >
            <Route index path="/admin/dashboard" element={<Home />} />

            {/* Users */}
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/add" element={<UserAdd />} />
            <Route path="/admin/users/:id/edit" element={<UserEdit />} />

            {/* Banners */}
            <Route path="/admin/banners" element={<BannersList />} />
            <Route path="/admin/banner/add" element={<BannerAdd />} />
            <Route path="/admin/banners/:id/edit" element={<BannerEdit />} />

            {/* Categories */}
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="/admin/category/add" element={<CategoryAdd />} />
            <Route path="/admin/category/:id/edit" element={<CategoryEdit />} />

            {/* Brands */}
            <Route path="/admin/brands" element={<BrandsList />} />
            <Route path="/admin/brand/add" element={<BrandAdd />} />
            <Route path="/admin/brand/:id/edit" element={<BrandEdit />} />

            {/* Products */}
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/product/add" element={<ProductAdd />} />
            <Route path="/admin/product/:id/edit" element={<ProductEdit />} />

            {/* Orders */}
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/order/:id" element={<OrderDetails />} />

            {/* Social Links */}
             <Route path="/admin/social-links" element={<SocialLinksManager />} />

            {/* Other pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/admin/signin" element={<SignIn />} />
          <Route path="/admin/signup" element={<SignUp />} />

          {/* Main App Layout */}
          <Route
            element={
              <AuthProvider>
                <MainLayout />
              </AuthProvider>
            }
          >
            <Route index path="/" element={<HomePage />} />
            <Route index path="/login" element={<LoginPage />} />
            <Route index path="/register" element={<RegisterPage />} />
            <Route index path="/cart" element={<CartPage />} />
            <Route index path="/wishlist" element={<WishlistPage />} />
            <Route index path="/contact-us" element={<ContactUsPage />} />
            <Route index path="/categories" element={<CategoriesPage />} />
            <Route index path="/faq" element={<FAQsPage />} />
            <Route index path="/sale" element={<SalePage />} />
            <Route index path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route index path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route index path="/return-policy" element={<ReturnPolicyPage />} />
            <Route index path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route index path="/terms-and-conditions" element={<TermsConditionsPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}
