import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const CartPage: React.FC = () => {
  const items = Array.from({ length: 3 }).map((_, i) => ({
    id: i + 1,
    name: `Cart Item ${i + 1}`,
    price: 59.99 + i * 10,
    qty: 1,
    image: import.meta.env.VITE_PLACEHOLDER_IMAGE || "https://via.placeholder.com/400x300.png?text=No+Image",
  }));
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="Cart | EcomPro" description="Your shopping cart at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Cart" />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded bg-gray-100">-</button>
                    <span className="px-3">{item.qty}</span>
                    <button className="h-8 w-8 rounded bg-gray-100">+</button>
                  </div>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$9.99</span></div>
              <div className="flex justify-between"><span>Tax</span><span>$4.50</span></div>
              <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>${(subtotal + 9.99 + 4.5).toFixed(2)}</span></div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;