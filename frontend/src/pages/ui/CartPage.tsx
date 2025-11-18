import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const CartPage: React.FC = () => {
  const items = Array.from({ length: 3 }).map((_, i) => ({
    id: i + 1,
    name: `Cart Item ${i + 1}`,
    price: 59.99 + i * 10,
    qty: 1,
    image:
      import.meta.env.VITE_PLACEHOLDER_IMAGE ||
      "https://via.placeholder.com/400x300.png?text=No+Image",
  }));

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta title="Cart | EcomPro" description="Your shopping cart at EcomPro" />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="Cart" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow">
            <div className="divide-y dark:divide-gray-700">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="
                    p-4 flex flex-col sm:flex-row sm:items-center 
                    gap-4 sm:gap-6
                  "
                >
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-24 h-48 sm:h-24 rounded object-cover"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* QUANTITY + REMOVE */}
                  <div className="flex sm:flex-col sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button className="
                        h-8 w-8 rounded bg-gray-100 dark:bg-slate-700 
                        hover:bg-gray-200 dark:hover:bg-slate-600
                        text-gray-800 dark:text-gray-100 transition
                      ">
                        -
                      </button>

                      <span className="px-3 text-gray-900 dark:text-gray-100">
                        {item.qty}
                      </span>

                      <button className="
                        h-8 w-8 rounded bg-gray-100 dark:bg-slate-700 
                        hover:bg-gray-200 dark:hover:bg-slate-600
                        text-gray-800 dark:text-gray-100 transition
                      ">
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button className="
                      text-red-600 hover:text-red-700 
                      dark:text-red-400 dark:hover:text-red-300 
                      font-medium text-sm
                    ">
                      Remove
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Shipping</span>
                <span>$9.99</span>
              </div>

              <div className="flex justify-between text-gray-800 dark:text-gray-100">
                <span>Tax</span>
                <span>$4.50</span>
              </div>

              <div className="
                border-t border-gray-300 dark:border-gray-700 pt-2 
                flex justify-between font-semibold text-gray-800 dark:text-gray-100
              ">
                <span>Total</span>
                <span>${(subtotal + 9.99 + 4.5).toFixed(2)}</span>
              </div>
            </div>

            <button className="
              mt-6 w-full bg-blue-600 text-white py-3 rounded-full 
              hover:bg-blue-700 transition-colors text-sm font-medium
            ">
              Proceed to Checkout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
