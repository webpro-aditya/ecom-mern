import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const res = await fetch(`${base}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      toast.success("Account created. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Register | EcomPro"
        description="Create your EcomPro account"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Register" />

        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg 
                border-gray-300 dark:border-slate-700 
                dark:bg-slate-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500"
                required
              />
            </div>

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

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Register
            </button>

            {/* Login link */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
