import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountAddressesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageMeta title="My Addresses | EcomPro" description="Manage your addresses at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Addresses" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Addresses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-white">Default Shipping Address</h3>
            <p className="text-gray-600 dark:text-gray-300">John Doe</p>
            <p className="text-gray-600 dark:text-gray-300">123 Commerce St</p>
            <p className="text-gray-600 dark:text-gray-300">City, ST 12345</p>
            <p className="text-gray-600 dark:text-gray-300">United States</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-gray-100 px-4 py-2 rounded dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]">Edit</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-white">Add New Address</h3>
            <form className="space-y-3">
              <input className="w-full h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Full Name" />
              <input className="w-full h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Address Line" />
              <div className="grid grid-cols-2 gap-3">
                <input className="h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="City" />
                <input className="h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Postal Code" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Address</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAddressesPage;