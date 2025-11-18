import React from "react";
import { usePublicFAQs } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";
import FAQAccordion from "../../components/tables/FAQAccordion";

const FAQsPage: React.FC = () => {
  const { data, loading } = usePublicFAQs();
  const faqs = data?.faqs || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="FAQs | EcomPro"
        description="Frequently asked questions for EcomPro"
      />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="FAQs" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Frequently Asked Questions
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <FAQAccordion faqs={faqs} />
        )}
      </div>
    </div>
  );
};

export default FAQsPage;
