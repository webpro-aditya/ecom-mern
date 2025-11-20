import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser } from "../../store/userSlice";
import { RootState, AppDispatch } from "../../store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/cart";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const { user } = result.payload;
      if (user.role === "customer") {
        toast.success(`Welcome back, ${user.name}!`);
        try {
          // Sync local cart to server upon login
          const { syncCartToServer } = await import("../../store/cartSlice");
          await dispatch(syncCartToServer());
        } catch {}
        navigate(next || "/cart", { replace: true });
      } else {
        toast.error("This login is for customers. Use admin login for admin/vendor.");
      }
    } else {
      toast.error((result.payload as string) || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Login | EcomPro"
        description="Login to your EcomPro account"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Login" />

        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg 
                border-gray-300 dark:border-slate-700 
                dark:bg-slate-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg 
                border-gray-300 dark:border-slate-700 
                dark:bg-slate-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Login
            </button>

            {/* Register link */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
