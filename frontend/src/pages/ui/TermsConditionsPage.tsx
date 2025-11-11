import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const TermsConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Terms & Conditions | EcomPro" description="Terms and conditions for using EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Terms & Conditions" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <p className="text-gray-600">By using EcomPro, you agree to the following terms.</p>
          <p className="text-gray-600">Please review our usage policies and customer obligations.</p>
          <p className="text-gray-600">Contact us for any clarifications regarding these terms.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;