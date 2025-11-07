import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import toast from "react-hot-toast";

// --- SVG Icons ---
const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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

const SlugIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 19h18M4 5l7 7-7 7m16 0l-7-7 7-7" />
  </svg>
);

// --- Loader ---
const FormLoader = () => (
  <div className="p-6 animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
    ))}
  </div>
);

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  image?: string;
}

export default function CategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState<CategoryData>({
    name: "",
    slug: "",
    description: "",
    parent: "",
    image: "",
  });

  const [parents, setParents] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}admin/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch category");

        setFormData({
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description || "",
          parent: data.category.parent?._id || "",
          image: data.category.image || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  // ✅ Fetch parent categories
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}admin/categories?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const parentOnly = data.categories.filter((cat: any) => cat.parent === null && cat._id !== id);
          setParents(parentOnly);
        }
      } catch (err) {
        console.error("Failed to fetch parent categories:", err);
      }
    };
    fetchParents();
  }, [id]);

  // ✅ Slug generation
  useEffect(() => {
    if (formData.name) {
      const newSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.name]);

  // ✅ Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("images", file));

    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}admin/images/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      if (data.paths?.length) {
        setFormData((prev) => ({ ...prev, image: data.paths[0] }));
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}admin/category/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update category");

      toast.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ UI
  return (
    <>
      <PageMeta title="Edit Category | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Edit Category" />

      <div className="mx-auto max-w-3xl">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <ComponentCard>
          {isLoading ? (
            <FormLoader />
          ) : (
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <CategoryIcon />
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

                {/* Slug */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">URL Slug</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <SlugIcon />
                    </div>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      readOnly
                      className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
                    />
                  </div>
                </div>

                {/* Parent */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Parent Category</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <ParentIcon />
                    </div>
                    <select
                      name="parent"
                      value={formData.parent || ""}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-10 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">None (Top-level category)</option>
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
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-3">
                      <DescriptionIcon />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full resize-none rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    ></textarea>
                  </div>
                </div>

                {/* ✅ Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Category Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon />
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Click to upload</span> or drag file
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${formData.image}`}
                        alt="Category"
                        className="h-24 rounded-md border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <Link
                    to="/admin/categories"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving || uploading}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
