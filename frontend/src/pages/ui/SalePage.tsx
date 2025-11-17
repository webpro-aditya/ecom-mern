import React from "react";
import { usePublicSaleProducts } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const SalePage: React.FC = () => {
  const { data, loading } = usePublicSaleProducts(12);

  const products = (data?.products || []).map((p, i) => ({
    id: p._id || i + 1,
    name: p.name,
    price: p.price || 0,
    image:
      p.images && p.images[0]
        ? `${import.meta.env.VITE_BACKEND_URL}${p.images[0]}`
        : import.meta.env.VITE_PLACEHOLDER_IMAGE ||
          "https://via.placeholder.com/400x300.png?text=No+Image",
    discount: 25,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Sale | EcomPro"
        description="Discover items on sale at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Sale" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Summer Sale
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Get up to 50% off on selected items
            </p>
          </div>

          {/* SORT + SHOW SELECTS */}
          <div className="flex items-center gap-3">
            <select className="h-10 px-3 border rounded-lg text-sm 
              border-gray-300 dark:border-slate-700 
              dark:bg-slate-900 dark:text-gray-100">
              <option>Sort by: Popular</option>
              <option>Sort by: Price Low to High</option>
              <option>Sort by: Price High to Low</option>
              <option>Sort by: Newest</option>
            </select>

            <select className="h-10 px-3 border rounded-lg text-sm 
              border-gray-300 dark:border-slate-700 
              dark:bg-slate-900 dark:text-gray-100">
              <option>Show: 8</option>
              <option>Show: 16</option>
              <option>Show: 24</option>
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg 
                overflow-hidden transition-all duration-300 
                hover:shadow-2xl hover:-translate-y-2"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-64 object-cover"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{p.discount}%
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {p.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                        ${(p.price * 1.25).toFixed(2)}
                      </span>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalePage;
