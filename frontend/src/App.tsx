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
import HomePage from "./pages/HomePage";

// Users
import UsersList from "./pages/Users/UsersList";
import UserAdd from "./pages/Users/UserAdd";
import UserEdit from "./pages/Users/UserEdit";

// Categories
import CategoriesList from "./pages/Categories/CategoriesList";
import CategoryAdd from "./pages/Categories/CategoryAdd";
import CategoryEdit from "./pages/Categories/CategoryEdit";

// Products
import ProductsList from "./pages/Products/ProductsList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";

// Orders
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";

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

            {/* Categories */}
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="/admin/category/add" element={<CategoryAdd />} />
            <Route path="/admin/category/:id/edit" element={<CategoryEdit />} />

            {/* Products */}
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/product/add" element={<ProductAdd />} />
            <Route path="/admin/product/:id/edit" element={<ProductEdit />} />

            {/* Orders */}
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/order/:id" element={<OrderDetails />} />

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
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}
