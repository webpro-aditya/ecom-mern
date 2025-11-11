import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountAddressesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="My Addresses | EcomPro" description="Manage your addresses at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Addresses" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Addresses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Default Shipping Address</h3>
            <p className="text-gray-600">John Doe</p>
            <p className="text-gray-600">123 Commerce St</p>
            <p className="text-gray-600">City, ST 12345</p>
            <p className="text-gray-600">United States</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-gray-100 px-4 py-2 rounded">Edit</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Address</h3>
            <form className="space-y-3">
              <input className="w-full h-11 px-3 border rounded" placeholder="Full Name" />
              <input className="w-full h-11 px-3 border rounded" placeholder="Address Line" />
              <div className="grid grid-cols-2 gap-3">
                <input className="h-11 px-3 border rounded" placeholder="City" />
                <input className="h-11 px-3 border rounded" placeholder="Postal Code" />
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