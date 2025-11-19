// frontend/src/pages/ui/CategoryProductsPage.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { usePublicCategoryProducts } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const CategoryProductsPage: React.FC = () => {
  const { slug = "" } = useParams();
  const [page, setPage] = useState(1);
  const { data, loading } = usePublicCategoryProducts(slug, page, 12);

  const products = (data?.products || []).map((p: any) => ({
    id: p._id,
    name: p.name,
    price: p.price || 0,
    image:
      p.images && p.images[0]
        ? `${import.meta.env.VITE_BACKEND_URL}${p.images[0]}`
        : import.meta.env.VITE_PLACEHOLDER_IMAGE ||
          "https://via.placeholder.com/400x300.png?text=No+Image",
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title={`${data?.category?.name || "Category"} | EcomPro`}
        description={`Browse products in ${data?.category?.name || slug}`}
      />
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle={data?.category?.name || "Category"} />

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {data?.category?.name || slug}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {data?.totalProducts ?? 0} items
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <Link
                  to={`/product/${p.id}`}
                  key={p.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover"
                  />
                  <div className="p-5 sm:p-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base sm:text-lg mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                    <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
                >
                  Prev
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;