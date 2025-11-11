import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const ContactUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageMeta title="Contact Us | EcomPro" description="Get in touch with EcomPro support" />
      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Contact Us" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Send us a message</h3>
            <form className="space-y-3">
              <input className="w-full h-11 px-3 border rounded" placeholder="Your Name" />
              <input className="w-full h-11 px-3 border rounded" placeholder="Email" type="email" />
              <input className="w-full h-11 px-3 border rounded" placeholder="Subject" />
              <textarea className="w-full h-28 px-3 border rounded" placeholder="Message" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Support</h3>
            <p className="text-gray-600">📞 +1 (555) 123-4567</p>
            <p className="text-gray-600">✉️ support@ecompro.com</p>
            <p className="text-gray-600">Mon–Fri, 9:00–18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;