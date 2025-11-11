import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Return Policy | EcomPro" description="Return policy for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Return Policy" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Return Policy</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <p className="text-gray-600">Returns accepted within 30 days of delivery.</p>
          <p className="text-gray-600">Items must be unused and in original packaging.</p>
          <p className="text-gray-600">Refunds processed within 5–7 business days.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;