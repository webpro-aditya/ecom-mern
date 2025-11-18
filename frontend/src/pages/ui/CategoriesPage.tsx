import React from "react";
import { usePublicCategories } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const CategoriesPage: React.FC = () => {
  const placeholder =
    import.meta.env.VITE_PLACEHOLDER_IMAGE ||
    "https://via.placeholder.com/400x300.png?text=No+Image";

  const { data, loading } = usePublicCategories();

  const sampleCategories = (data?.categories || []).map((c, idx) => ({
    id: String(idx + 1),
    name: c.name,
    slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
    image: c.image,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Categories | EcomPro"
        description="Browse product categories at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Categories" />

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Shop by Category
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover our curated collections
          </p>
        </div>

        {/* Preloader */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleCategories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg dark:bg-slate-800 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      category.image || placeholder
                    }`}
                    alt={category.name}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Text */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">View Collection</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
