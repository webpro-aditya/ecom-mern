import React from "react";
import { usePublicPage } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const TermsConditionsPage: React.FC = () => {
  const { data, loading } = usePublicPage("terms-and-conditions");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Terms & Conditions | EcomPro"
        description="Terms and conditions for using EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Terms & Conditions" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Terms & Conditions
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 space-y-4">
            <div
              className="
                prose max-w-none

                prose-headings:text-gray-900
                prose-p:text-gray-700
                prose-li:text-gray-700
                prose-strong:text-gray-900
                prose-a:text-blue-600

                dark:prose-headings:text-gray-100
                dark:prose-p:text-gray-300
                dark:prose-li:text-gray-300
                dark:prose-strong:text-gray-100
                dark:prose-a:text-blue-400
              "
              dangerouslySetInnerHTML={{ __html: data?.page?.html || "" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsConditionsPage;
