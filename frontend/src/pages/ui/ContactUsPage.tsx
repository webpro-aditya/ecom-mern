import React from "react";
import { usePublicContact } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const ContactUsPage: React.FC = () => {
  const { data, loading } = usePublicContact();
  const contact = data?.contact;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="Contact Us | EcomPro"
        description="Get in touch with EcomPro support"
      />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <PageBreadcrumb pageTitle="Contact Us" />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Send us a message
            </h3>

            <form className="space-y-3">
              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Your Name"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Email"
                type="email"
              />

              <input
                className="w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Subject"
              />

              <textarea
                className="w-full h-28 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100"
                placeholder="Message"
              />

              <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* SUPPORT INFO */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Customer Support
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Preloader />
              </div>
            ) : (
              <div className="space-y-2 text-sm sm:text-base">
                <p className="text-gray-700 dark:text-gray-300">
                  📞 {contact?.phone}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  ✉️ {contact?.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {contact?.address}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
