import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountAddressesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="My Addresses | EcomPro"
        description="Manage your addresses at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Addresses" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Addresses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SHIPPING ADDRESS CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Default Shipping Address
            </h3>

            <p className="text-gray-600 dark:text-gray-300">John Doe</p>
            <p className="text-gray-600 dark:text-gray-300">123 Commerce St</p>
            <p className="text-gray-600 dark:text-gray-300">City, ST 12345</p>
            <p className="text-gray-600 dark:text-gray-300">United States</p>

            <div className="mt-4 flex gap-3">
              <button className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600">
                Edit
              </button>

              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>

          {/* ADD ADDRESS CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Add New Address
            </h3>

            <form className="space-y-3">
              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Full Name"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Address Line"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                  placeholder="City"
                />

                <input
                  className="h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                  placeholder="Postal Code"
                />
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAddressesPage;
