import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { EditIcon, DeleteIcon } from "../../icons";

export default function SocialLinksManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon: "",
    sequence: "",
    isActive: true,
  });

  // Fetch all links
  const fetchLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/social-links`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

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
          Authorization: `Bearer ${token}`,
        },
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

  // Handle delete (with modal)
  const openDeleteModal = (link) => {
    setLinkToDelete(link);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!linkToDelete) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}admin/social-link/delete/${linkToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
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

  // Handle edit button
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

  // Reset form
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

        <ComponentCard>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Icon
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Sequence
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Active
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-5 text-center text-slate-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-5 text-center text-slate-500"
                    >
                      No social links found
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link._id}>
                      <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                        {link.platform}
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.url}
                        </a>
                      </td>
                      <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                        <i className={link.icon}></i> {link.icon}
                      </td>
                      <td className="px-6 py-3 text-center text-slate-600 dark:text-slate-300">
                        {link.sequence}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            link.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {link.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(link)}
                            title="Edit"
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => openDeleteModal(link)}
                            title="Delete"
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>

      {/* Create / Edit Modal */}
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
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
