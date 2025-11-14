import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const WishlistPage: React.FC = () => {
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: `Wishlist Item ${i + 1}`,
    price: 99.99 + i,
    image: import.meta.env.VITE_PLACEHOLDER_IMAGE || "https://via.placeholder.com/400x300.png?text=No+Image",
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <PageMeta title="Wishlist | EcomPro" description="Your saved items at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Wishlist" />

        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Your Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-slate-800">
              <img src={item.image} alt={item.name} className="w-40 h-40 object-cover" />
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-gray-600 mb-4 dark:text-gray-300">${item.price.toFixed(2)}</p>
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Add to Cart</button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">Remove</button>
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
