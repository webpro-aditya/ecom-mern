import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="Shipping Policy | EcomPro" description="Shipping information for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Shipping Policy" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipping Policy</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <p className="text-gray-600">We offer free shipping on orders over $50.</p>
          <p className="text-gray-600">Standard delivery takes 3–7 business days.</p>
          <p className="text-gray-600">Express options available at checkout.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;