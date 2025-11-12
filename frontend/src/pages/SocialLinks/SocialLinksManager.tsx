import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { EditIcon, DeleteIcon } from "../../icons";
import SkeletonRow from "../../components/common/SkeletonRow";

export default function SocialLinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const token = useSelector((state: RootState) => state.user.token);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "",
    sequence: "",
    isActive: true,
  });

  const fetchLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}admin/social-links`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setLinks(data.data);
      else setError(data.message || "Failed to load social links");
    } catch (err) {
      console.error(err);
      setError("Error fetching social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editing;
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}admin/social-link/update/${editing._id}`
      : `${import.meta.env.VITE_API_URL}admin/social-link/create`;

    const method = isEdit ? "PUT" : "POST";

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      setShowModal(false);
      setEditing(null);
      fetchLinks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (link) => {
    setLinkToDelete(link);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/social-link/delete/${linkToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "X-CSRF-Token": (document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)?.[1] && decodeURIComponent(document.cookie.match(/(?:^|; )csrfToken=([^;]+)/)![1])) || "" },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchLinks();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmOpen(false);
      setLinkToDelete(null);
    }
  };

  const handleEdit = (link) => {
    setEditing(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      sequence: link.sequence,
      isActive: link.isActive,
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      platform: "",
      url: "",
      icon: "",
      sequence: "",
      isActive: true,
    });
    setShowModal(true);
  };

  return (
    <>
      <PageMeta title="Social Links | Admin Dashboard" />
      <PageBreadcrumb pageTitle="Social Links" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Manage Social Links
          </h2>
          <button
            onClick={handleAddNew}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Add New
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Tile Grid View */}
        <ComponentCard>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No social links found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {links.map((link) => (
                <div
                  key={link._id}
                  className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all group"
                >
                  {/* Icon Circle */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-4 text-3xl">
                    <i className={link.icon}></i>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {link.platform}
                    </h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 text-sm truncate hover:underline mt-1"
                    >
                      {link.url}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Sequence: {link.sequence || "—"}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        link.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(link)}
                      title="Edit"
                      className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => openDeleteModal(link)}
                      title="Delete"
                      className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {editing ? "Edit Social Link" : "Add Social Link"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Platform
                </label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Icon (FontAwesome Class)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., fab fa-facebook"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sequence
                </label>
                <input
                  type="number"
                  name="sequence"
                  value={formData.sequence}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Active
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${linkToDelete?.platform}"? This action cannot be undone.`}
      />
    </>
  );
}
