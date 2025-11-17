import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountDashboardPage: React.FC = () => {
  const stats = [
    { label: "Orders", value: 12, color: "text-blue-600 dark:text-blue-400" },
    { label: "Wishlist", value: 8, color: "text-pink-600 dark:text-pink-400" },
    { label: "Addresses", value: 2, color: "text-green-600 dark:text-green-400" },
    { label: "Rewards", value: 120, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="My Account | EcomPro"
        description="Customer account dashboard at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Account" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Dashboard
        </h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center dark:text-gray-100"
            >
              <div className={`text-3xl font-bold mb-2 ${s.color}`}>
                {s.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ORDER + DETAILS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Recent Orders
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You have 3 recent orders.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Account Details
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Update your email, name and password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
