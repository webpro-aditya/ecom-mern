import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import toast from "react-hot-toast";

// --- SVG Icons ---
const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const DescriptionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ParentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 19h18M4 5l7 7-7 7m16 0l-7-7 7-7" />
  </svg>
);

export default function BrandEdit() {
  const params = useParams<{ id?: string; slug?: string }>();
  const slug = params.slug || params.id;


  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    parent: "",
    isActive: true,
  });

  const [parents, setParents] = useState<{ _id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch parent brands
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}admin/brands?limit=500`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.data) {
          const topLevel = data.data.filter((b: any) => !b.parent);
          setParents(topLevel);
        }
      } catch (err) {
        console.error("Failed to fetch parent brands", err);
      }
    };
    fetchParents();
  }, []);

  // ✅ Fetch brand details
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}admin/brand/${slug}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch brand");
        const brand = data.data || data; // handle API format flexibility

        setFormData({
          name: brand.name || "",
          description: brand.description || "",
          logo: brand.logo || "",
          parent: brand.parent?._id || "",
          isActive: brand.isActive ?? true,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchBrand();
  }, [slug]);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();
    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    const valid = files.filter((f) => allowed.includes(f.type) && f.size <= maxSize);
    valid.forEach((file) => uploadData.append("images", file));

    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}admin/images/upload`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "" },
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      if (data.paths?.length) {
        setFormData((prev) => ({ ...prev, logo: data.paths[0] }));
        toast.success("Logo updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.name) {
      setError("Brand name is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}admin/brand/update/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update brand.");

      toast.success("Brand updated successfully!");
      navigate("/admin/brands");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-10 text-center text-slate-500 dark:text-slate-400">
        Loading brand details...
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`Edit Brand - ${formData.name} | Admin Dashboard`} />
      <PageBreadcrumb pageTitle={`Edit Brand: ${formData.name}`} />

      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Brand</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update brand details and logo</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <ComponentCard>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <BrandIcon />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Parent Brand */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Parent Brand (Optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <ParentIcon />
                  </div>
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-10 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">None (Top-level)</option>
                    {parents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3.5 top-3">
                    <DescriptionIcon />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe this brand..."
                    className="block w-full resize-none rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  ></textarea>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Brand Logo
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon />
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Click to upload</span> or drag file
                    </p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {formData.logo && (
                  <div className="mt-4">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${formData.logo}`}
                      alt="Brand Logo"
                      className="h-20 rounded-md border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Active Brand
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                <Link
                  to="/admin/brands"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Brand"}
                </button>
              </div>
            </form>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
