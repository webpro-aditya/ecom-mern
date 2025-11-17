import React from "react";
import { usePublicFAQs } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const FAQsPage: React.FC = () => {
  const { data, loading } = usePublicFAQs();
  const faqs = data?.faqs || [];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <PageMeta title="FAQs | EcomPro" description="Frequently asked questions for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="FAQs" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Frequently Asked Questions</h1>
        {loading ? (
          <div className="flex justify-center py-12"><Preloader /></div>
        ) : (
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-white">{f.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{f.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQsPage;
