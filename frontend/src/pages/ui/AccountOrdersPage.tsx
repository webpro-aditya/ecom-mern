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
    <div className="min-h-screen bg-white">
      <PageMeta title="My Orders | EcomPro" description="View your orders at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Orders" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 text-sm text-gray-500">Order #</th>
                <th className="text-left p-3 text-sm text-gray-500">Date</th>
                <th className="text-left p-3 text-sm text-gray-500">Status</th>
                <th className="text-left p-3 text-sm text-gray-500">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3 font-medium text-gray-800">{o.id}</td>
                  <td className="p-3 text-gray-600">{o.date}</td>
                  <td className="p-3 text-gray-600">{o.status}</td>
                  <td className="p-3 text-gray-800">${o.total.toFixed(2)}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountOrdersPage;