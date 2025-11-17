import React from "react";
import { usePublicPage } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const PrivacyPolicyPage: React.FC = () => {
  const { data, loading } = usePublicPage("privacy-policy");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <PageMeta title="Privacy Policy | EcomPro" description="Privacy policy for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Privacy Policy" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Privacy Policy</h1>
        {loading ? (
          <div className="flex justify-center py-12"><Preloader /></div>
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

export default PrivacyPolicyPage;
