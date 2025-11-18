import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const WishlistPage: React.FC = () => {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: `Wishlist Item ${i + 1}`,
    price: 99.99 + i,
    image:
      import.meta.env.VITE_PLACEHOLDER_IMAGE ||
      "https://via.placeholder.com/400x300.png?text=No+Image",
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Wishlist | EcomPro"
        description="Your saved items at EcomPro"
      />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="Wishlist" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Your Wishlist
        </h1>

        {/* Grid responsive: 1 → 2 → 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 sm:w-40 sm:h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mt-1 mb-4 text-sm sm:text-base">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    className="
  flex items-center justify-center gap-2 
  bg-blue-600 text-white px-4 py-2 rounded-full text-sm 
  shadow-md hover:shadow-lg active:scale-95 
  hover:bg-blue-700 transition-all w-full sm:w-auto
"
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    className="
  flex items-center justify-center gap-2
  bg-red-600 text-white px-4 py-2 rounded-full text-sm 
  shadow-md hover:shadow-lg active:scale-95 
  hover:bg-red-700 dark:hover:bg-red-500 transition-all w-full sm:w-auto
"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
