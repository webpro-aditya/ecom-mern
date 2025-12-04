import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";
import { RootState } from "../../store";

const AccountOrdersPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${base}user/orders/my`, {
          method: "GET",
          credentials: "include",
          headers,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch orders");
        }
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta title="My Orders | EcomPro" description="View your orders at EcomPro" />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="My Orders" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Orders
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Preloader /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-md dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden hidden md:block">
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
                  <tr key={o._id} className="hover:bg-gray-100 dark:hover:bg-slate-700/40">
                    <td className="p-3 font-medium">{o.orderNumber || o._id.substring(0,7).toUpperCase()}</td>
                    <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="p-3 capitalize">{o.status}</td>
                    <td className="p-3">{(o.currency || "₹")}{Number(o.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="md:hidden space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Order #</span>
                  <span className="font-semibold">{o.orderNumber || o._id.substring(0,7).toUpperCase()}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</span>
                  <span>{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${o.status === "delivered" ? "text-green-600 dark:text-green-400" : o.status === "cancelled" ? "text-red-600 dark:text-red-400" : "text-yellow-500 dark:text-yellow-400"}`}>{o.status}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
                  <span className="font-semibold">{(o.currency || "₹")}{Number(o.totalAmount || 0).toFixed(2)}</span>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">View Details</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AccountOrdersPage;
