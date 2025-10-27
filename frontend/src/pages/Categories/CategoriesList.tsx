import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoriesAccordion from "../../components/tables/CategoriesAccordion";
import Pagination from "../../components/common/Pagination";
import { useCategories } from "../../hooks/useCategories";
import { Toaster } from "react-hot-toast";

export default function CategoriesList() {
  const {
    categories,
    loading,
    page,
    limit,
    sortBy,
    sortOrder,
    totalPages,
    total,
    search,
    setSearch,
    setPage,
    setLimit,
    handleSort,
    handleDeleteCategory,
  } = useCategories();

  return (
    <>
      <PageMeta title="Categories List | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Categories" />

      <ComponentCard>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
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

        <CategoriesAccordion
          categories={categories}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onDelete={handleDeleteCategory}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </ComponentCard>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{ zIndex: 2147483647 }}
      />
    </>
  );
}
