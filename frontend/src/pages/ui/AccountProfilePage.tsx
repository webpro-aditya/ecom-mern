import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Account Profile | EcomPro" description="Manage your profile at EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Account Profile" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="h-11 px-3 border rounded" placeholder="First Name" />
                <input className="h-11 px-3 border rounded" placeholder="Last Name" />
              </div>
              <input className="w-full h-11 px-3 border rounded" placeholder="Email" />
              <input className="w-full h-11 px-3 border rounded" placeholder="Phone (optional)" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <form className="space-y-3">
              <input className="w-full h-11 px-3 border rounded" placeholder="Current Password" type="password" />
              <input className="w-full h-11 px-3 border rounded" placeholder="New Password" type="password" />
              <input className="w-full h-11 px-3 border rounded" placeholder="Confirm New Password" type="password" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfilePage;