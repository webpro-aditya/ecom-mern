import React from "react";
import { useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { RootState } from "../../store";

const CheckoutPage: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const subtotal = items.reduce((sum, it) => sum + Number(it.price || 0) * it.qty, 0);
  const shipping = items.length > 0 ? 9.99 : 0;
  const tax = items.length > 0 ? 4.5 : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta title="Checkout | EcomPro" description="Complete your purchase" />
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="Checkout" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Items</h2>
            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-600 dark:text-gray-300">Your cart is empty.</div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {items.map((it) => (
                  <div key={it.key} className="py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <img
                      src={it.image || (import.meta.env.VITE_PLACEHOLDER_IMAGE || "https://via.placeholder.com/400x300.png?text=No+Image")}
                      alt={it.name}
                      className="w-full sm:w-24 h-48 sm:h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{it.name}</h3>
                        <span className="text-gray-800 dark:text-gray-100">${Number(it.price).toFixed(2)}</span>
                      </div>
                      {it.attributes && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {Object.entries(it.attributes).map(([k, v]) => (
                            <span key={k} className="mr-3">{k}: {v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-700 dark:text-gray-200">Qty: {it.qty}</div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">${(Number(it.price) * it.qty).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 pt-2 flex justify-between font-semibold text-gray-800 dark:text-gray-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;