import React from "react";
import { usePublicPage } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const ReturnPolicyPage: React.FC = () => {
  const { data, loading } = usePublicPage("return-policy");
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <PageMeta title="Return Policy | EcomPro" description="Return policy for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Return Policy" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Return Policy</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4 dark:bg-slate-800">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: data?.page?.html || "" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
