import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Pagination from "../../components/common/Pagination";
import { Toaster } from "react-hot-toast";
import OrdersTable from "../../components/tables/OrdersTable";
import { useOrders } from "../../hooks/useOrders";

export default function OrdersList() {
  const ordersData = useOrders();
  // You can expand this to include tab selection if needed in future
  // const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <PageMeta title="Orders | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Orders" />

      <ComponentCard>
        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="search"
            value={ordersData.search}
            onChange={e => ordersData.setSearch(e.target.value)}
            placeholder="Search orders by customer, ID, or email..."
            className="w-full md:w-1/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <select
            value={ordersData.limit}
            onChange={e => ordersData.setLimit(Number(e.target.value))}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <select
            value={ordersData.status}
            onChange={e => ordersData.setStatus(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* ORDERS TABLE */}
        <OrdersTable
          orders={ordersData.orders}
          loading={ordersData.loading}
          sortBy={ordersData.sortBy}
          sortOrder={ordersData.sortOrder}
          onSort={ordersData.handleSort}
        />

        <Pagination
          currentPage={ordersData.page}
          totalPages={ordersData.totalPages}
          onPageChange={ordersData.setPage}
        />
      </ComponentCard>

      {/* Toasts */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{ zIndex: 2147483647 }}
      />
    </>
  );
}
