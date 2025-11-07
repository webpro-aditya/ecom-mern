import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BrandsAccordion from "../../components/tables/BrandsAccordion";
import Pagination from "../../components/common/Pagination";
import { useBrands } from "../../hooks/useBrands";
import { Toaster } from "react-hot-toast";

export default function BrandsList() {
  const {
    brands,
    loading,
    page,
    limit,
    totalPages,
    search,
    setSearch,
    setPage,
    setLimit,
    handleDeleteBrand,
  } = useBrands();

  return (
    <>
      <PageMeta title="Brands List | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Brands" />

      <ComponentCard>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand name..."
            className="w-full md:w-1/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={500}>All</option>
          </select>
        </div>

        <BrandsAccordion
          brands={brands}
          loading={loading}
          onDelete={handleDeleteBrand}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </ComponentCard>

      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{ zIndex: 2147483647 }}
      />
    </>
  );
}
