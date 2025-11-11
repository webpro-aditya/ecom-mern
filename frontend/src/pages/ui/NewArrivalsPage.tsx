import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const NewArrivalsPage: React.FC = () => {
  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `New Arrival ${i + 1}`,
    price: 79.99 + i,
    image: import.meta.env.VITE_PLACEHOLDER_IMAGE || "https://via.placeholder.com/400x300.png?text=No+Image",
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="New Arrivals | EcomPro" description="Discover the latest arrivals at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="New Arrivals" />

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Just In</h1>
          <p className="text-gray-600">Fresh picks curated for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-full h-64 object-cover" />
                <div className="absolute top-4 right-4">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">♥️</button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">${p.price.toFixed(2)}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;