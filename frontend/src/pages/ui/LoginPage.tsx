import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook into auth login
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Login | EcomPro" description="Login to your EcomPro account" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Login" />
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors">Login</button>
            <p className="text-sm text-center text-gray-600">
              Don’t have an account? <a href="/register" className="text-blue-600 hover:text-blue-700">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;