import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";
import { Toaster } from "react-hot-toast";
import ProductsTable from "../../components/tables/ProductsTable";
import { useProducts } from "../../hooks/useProducts";

export default function ProductsList() {
  const [activeTab, setActiveTab] = useState("simple");

  // Simple Products
  const simpleProducts = useProducts("simple");
  // Variable Products
  const variableProducts = useProducts("variable");

  const tabConfig = {
    simple: simpleProducts,
    variable: variableProducts,
  };

  const current = tabConfig[activeTab];

  return (
    <>
      <PageMeta title="Products | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Products" />

      <ComponentCard>
        {/* TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {["simple", "variable"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-500"
              }`}
            >
              {tab === "simple" ? "Simple Products" : "Variable Products"}
            </button>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={current.search}
            onChange={(e) => current.setSearch(e.target.value)}
            placeholder={`Search ${activeTab} products...`}
            className="w-full md:w-1/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <select
            value={current.limit}
            onChange={(e) => current.setLimit(Number(e.target.value))}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        {/* PRODUCT TABLE */}
        <ProductsTable
          products={current.products}
          loading={current.loading}
          onSort={current.handleSort}
          sortBy={current.sortBy}
          sortOrder={current.sortOrder}
          onDelete={current.handleDeleteProduct}
        />

        <Pagination
          currentPage={current.page}
          totalPages={current.totalPages}
          onPageChange={current.setPage}
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
