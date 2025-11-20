import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addItem } from "../../store/cartSlice";
import { usePublicSaleProducts } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const SalePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="Sale" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Summer Sale
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Get up to 50% off on selected items
            </p>
          </div>

          {/* Sort / Show */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select className="h-10 px-3 border rounded-lg text-sm 
              border-gray-300 dark:border-slate-700 
              dark:bg-slate-900 dark:text-gray-100 w-full sm:w-auto">
              <option>Sort by: Popular</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Newest</option>
            </select>

            <select className="h-10 px-3 border rounded-lg text-sm 
              border-gray-300 dark:border-slate-700 
              dark:bg-slate-900 dark:text-gray-100 w-full sm:w-auto">
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
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-6
            "
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="
                  group bg-white dark:bg-slate-800 rounded-2xl shadow-lg 
                  overflow-hidden transition-all duration-300 
                  hover:shadow-2xl hover:-translate-y-2
                "
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-cover"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{p.discount}%
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-base sm:text-lg line-clamp-2">
                    {p.name}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                        ${(p.price * 1.25).toFixed(2)}
                      </span>
                    </div>

                    {/* Updated Add to Cart Button (compact) */}
                    <button
                      onClick={() => {
                        dispatch(
                          addItem({
                            productId: String(p.id),
                            name: p.name,
                            price: Number(p.price || 0),
                            image: p.image,
                          })
                        );
                      }}
                      className="
                        flex items-center justify-center gap-2
                        bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium
                        shadow-md hover:shadow-xl
                        hover:bg-blue-700 active:scale-95 
                        transition-all
                        w-full sm:w-auto
                      "
                    >
                      🛒 Add to Cart
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
