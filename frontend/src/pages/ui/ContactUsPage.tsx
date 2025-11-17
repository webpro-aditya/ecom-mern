import React from "react";
import { usePublicContact } from "../../hooks/usePublic";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";

const ContactUsPage: React.FC = () => {
  const { data, loading } = usePublicContact();
  const contact = data?.contact;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <PageMeta title="Contact Us | EcomPro" description="Get in touch with EcomPro support" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Contact Us" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Send us a message</h3>
            <form className="space-y-3">
              <input className="w-full h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Your Name" />
              <input className="w-full h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Email" type="email" />
              <input className="w-full h-11 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Subject" />
              <textarea className="w-full h-28 px-3 border rounded dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Message" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 dark:bg-slate-800 dark:text-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Support</h3>
            {loading ? (
              <div className="flex justify-center py-8"><Preloader /></div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300">📞 {contact?.phone}</p>
                <p className="text-gray-600 dark:text-gray-300">✉️ {contact?.email}</p>
                <p className="text-gray-600 dark:text-gray-300">{contact?.address}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
