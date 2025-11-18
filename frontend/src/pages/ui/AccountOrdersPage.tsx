import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountOrdersPage: React.FC = () => {
  const orders = Array.from({ length: 5 }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    date: "2025-10-01",
    total: 129.99 + i * 10,
    status: i % 2 === 0 ? "Delivered" : "Processing",
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta title="My Orders | EcomPro" description="View your orders at EcomPro" />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="My Orders" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Orders
        </h1>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">
          <table className="w-full text-gray-800 dark:text-gray-200">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700">
                <th className="text-left p-3 text-sm text-gray-500 dark:text-gray-300">Order #</th>
                <th className="text-left p-3 text-sm text-gray-500 dark:text-gray-300">Date</th>
                <th className="text-left p-3 text-sm text-gray-500 dark:text-gray-300">Status</th>
                <th className="text-left p-3 text-sm text-gray-500 dark:text-gray-300">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-gray-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/40">
                  <td className="p-3 font-medium">{o.id}</td>
                  <td className="p-3">{o.date}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">${o.total.toFixed(2)}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD LIST */}
        <div className="md:hidden space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow p-4"
            >
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order #
                </span>
                <span className="font-semibold">{o.id}</span>
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </span>
                <span>{o.date}</span>
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={
                    o.status === "Delivered"
                      ? "text-green-600 dark:text-green-400 font-medium"
                      : "text-yellow-500 dark:text-yellow-400 font-medium"
                  }
                >
                  {o.status}
                </span>
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </span>
                <span className="font-semibold">${o.total.toFixed(2)}</span>
              </div>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                View Details
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AccountOrdersPage;
