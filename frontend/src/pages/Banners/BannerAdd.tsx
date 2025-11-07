import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";

export default function BannerAdd() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    htmlContent: "",
    redirectUrl: "",
    image: "",
    startDate: null,
    endDate: null,
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("images", file));

    try {
      setUploading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/images/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      if (data.paths?.length) {
        setFormData((prev) => ({ ...prev, image: data.paths[0] }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate
          ? formData.startDate.toISOString().split("T")[0]
          : null,
        endDate: formData.endDate
          ? formData.endDate.toISOString().split("T")[0]
          : null,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/banner/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create banner");

      navigate("/admin/banners");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Add Banner | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Add Banner" />

      <div className="mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} noValidate>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Add New Banner
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload banner image and details for homepage display
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/banners"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-900"
              >
                {loading ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Create Banner"
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <ComponentCard>
                <div className="p-6 space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Banner Details
                  </h3>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter banner title"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      HTML Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="htmlContent"
                      rows={4}
                      value={formData.htmlContent}
                      onChange={handleChange}
                      placeholder="<h2>Summer Sale</h2><p>Up to 50% off</p>"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Redirect URL
                    </label>
                    <input
                      type="text"
                      name="redirectUrl"
                      value={formData.redirectUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/sale"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </ComponentCard>

              {/* Image Upload */}
              <ComponentCard>
                <div className="p-6">
                  <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                    Banner Image
                  </h3>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag & drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          PNG, JPG or WEBP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.image && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${
                              formData.image
                            }`}
                            alt="Banner Preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ComponentCard>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <ComponentCard>
                <div className="p-6 space-y-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Banner Settings
                  </h3>

                  {/* DatePickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Start Date
                      </label>
                      <DatePicker
                        selected={formData.startDate}
                        onChange={(date) =>
                          setFormData((prev) => ({ ...prev, startDate: date }))
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                        popperPlacement="bottom-start"
                        showPopperArrow={false}
                        calendarStartDay={1}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                          dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        End Date
                      </label>
                      <DatePicker
                        selected={formData.endDate}
                        onChange={(date) =>
                          setFormData((prev) => ({ ...prev, endDate: date }))
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                          dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      Active Banner
                    </label>
                  </div>
                </div>
              </ComponentCard>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
