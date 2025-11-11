import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="Privacy Policy | EcomPro" description="Privacy policy for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Privacy Policy" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <p className="text-gray-600">We respect your privacy and protect your personal data.</p>
          <p className="text-gray-600">We do not sell your information to third parties.</p>
          <p className="text-gray-600">See full details of our data practices below.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;