import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";
import toast from "react-hot-toast";

export default function BannerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.user.token);

  const [formData, setFormData] = useState({
    title: "",
    htmlContent: "",
    redirectUrl: "",
    sequence: "",
    image: "",
    startDate: null,
    endDate: null,
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch banner details
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}admin/banner/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success && data.data) {
          const b = data.data;
          setFormData({
            title: b.title || "",
            htmlContent: b.htmlContent || "",
            redirectUrl: b.redirectUrl || "",
            sequence: b.sequence?.toString() || "",
            image: b.image || "",
            startDate: b.startDate ? new Date(b.startDate) : null,
            endDate: b.endDate ? new Date(b.endDate) : null,
            isActive: b.isActive ?? true,
          });
        } else {
          toast.error(data.message || "Failed to load banner details");
        }
      } catch (err) {
        toast.error("Error loading banner details");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const uploadData = new FormData();
    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    const valid = files.filter((f) => allowed.includes(f.type) && f.size <= maxSize);
    valid.forEach((file) => uploadData.append("images", file));

    try {
      setUploading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/images/upload`,
        {
          method: "POST",
          credentials: "include",
          headers: { "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "" },
          body: uploadData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      if (data.paths?.length) {
        setFormData((prev) => ({ ...prev, image: data.paths[0] }));
        toast.success("Image uploaded successfully");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle submit (PUT update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { sequence, ...payloadWithoutSequence } = formData;

      const payload = {
        ...payloadWithoutSequence,
        startDate: formData.startDate
          ? formData.startDate.toISOString().split("T")[0]
          : null,
        endDate: formData.endDate
          ? formData.endDate.toISOString().split("T")[0]
          : null,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/banner/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to update banner");

      toast.success("Banner updated successfully");
      navigate("/admin/banners");
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-slate-600 dark:text-slate-400">
          Loading banner details...
        </p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Edit Banner | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Edit Banner" />

      <div className="mx-auto max-w-6xl">
        <form onSubmit={handleSubmit} noValidate>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Edit Banner
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update banner details and image
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/banners"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
              >
                {saving ? "Saving..." : "Update Banner"}
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
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      HTML Content
                    </label>
                    <textarea
                      name="htmlContent"
                      rows={4}
                      value={formData.htmlContent}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </ComponentCard>

              {/* Banner Image */}
              <ComponentCard>
                <div className="p-6">
                  <h3 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
                    Banner Image
                  </h3>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        Click to upload or drag image
                      </span>
                    </label>

                    {formData.image && (
                      <div className="relative mt-4">
                        <img
                          src={
                            formData.image.startsWith("http")
                              ? formData.image
                              : `${import.meta.env.VITE_BACKEND_URL}${formData.image}`
                          }
                          alt="Banner"
                          className="rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ComponentCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ComponentCard>
                <div className="p-6 space-y-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Banner Settings
                  </h3>

                  {/* Sequence (View Only) */}
                  <div>
                    <label className="block text-sm mb-2 font-medium text-slate-700 dark:text-slate-300">
                      Sequence
                    </label>
                    <input
                      type="number"
                      name="sequence"
                      value={formData.sequence}
                      readOnly
                      className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-slate-600 cursor-not-allowed dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Auto-assigned order (cannot be changed)
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium text-slate-700 dark:text-slate-300">
                        Start Date
                      </label>
                      <DatePicker
                        selected={formData.startDate}
                        onChange={(date) =>
                          setFormData((prev) => ({ ...prev, startDate: date }))
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium text-slate-700 dark:text-slate-300">
                        End Date
                      </label>
                      <DatePicker
                        selected={formData.endDate}
                        onChange={(date) =>
                          setFormData((prev) => ({ ...prev, endDate: date }))
                        }
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Active */}
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
