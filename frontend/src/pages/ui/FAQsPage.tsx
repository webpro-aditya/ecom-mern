import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const FAQsPage: React.FC = () => {
  const faqs = [
    { q: "How do I track my order?", a: "Use the Track Order link in the header." },
    { q: "What is your return policy?", a: "30-day returns on most items." },
    { q: "How can I contact support?", a: "Email support@ecompro.com or call us." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="FAQs | EcomPro" description="Frequently asked questions for EcomPro" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="FAQs" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.q}</h3>
              <p className="text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;