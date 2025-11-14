import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook into auth register
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <PageMeta title="Register | EcomPro" description="Create your EcomPro account" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Register" />
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 dark:bg-slate-800 dark:text-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border rounded-lg focus:outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors">Register</button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
