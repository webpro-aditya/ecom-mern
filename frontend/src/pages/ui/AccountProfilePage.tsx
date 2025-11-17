import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const AccountProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Account Profile | EcomPro"
        description="Manage your profile at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Account Profile" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERSONAL INFO */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Personal Information
            </h3>

            <form className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                  placeholder="First Name"
                />
                <input
                  className="h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                  placeholder="Last Name"
                />
              </div>

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Email"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Phone (optional)"
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>

          {/* PASSWORD CHANGE */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Change Password
            </h3>

            <form className="space-y-3">
              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Current Password"
                type="password"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="New Password"
                type="password"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Confirm New Password"
                type="password"
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfilePage;
