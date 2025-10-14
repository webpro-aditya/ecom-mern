import { useState } from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon } from "../../icons";
import ConfirmationModal from "../common/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductsTable({
  products,
  loading,
  onSort,
  sortBy,
  sortOrder,
  onDelete,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const SortIcon = ({ active, direction }) => (
    <svg
      className={`w-4 h-4 ml-1 ${active ? "text-blue-500" : "text-gray-400"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === "asc" ? (
        <path
          d="M5 15l7-7 7 7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M19 9l-7 7-7-7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  const SortableHeader = ({ field, children }) => (
    <th
      onClick={() => onSort(field)}
      className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
    >
      <div className="flex items-center">
        {children}
        <SortIcon active={sortBy === field} direction={sortOrder} />
      </div>
    </th>
  );

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await onDelete(productToDelete._id);
      handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading products...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
              Image
            </th>
            <SortableHeader field="name">Name</SortableHeader>
            <SortableHeader field="type">Type</SortableHeader>
            <SortableHeader field="price">Price</SortableHeader>
            <SortableHeader field="stock">Stock</SortableHeader>
            <SortableHeader field="category">Category</SortableHeader>
            <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-10 text-slate-500 dark:text-slate-400"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-700">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={`${API_URL}${p.images[0]}`}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-slate-400 text-xs">
                        No Img
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {p.name}
                </td>
                <td className="p-4 capitalize text-slate-600 dark:text-slate-400">
                  {p.type}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {p.type === "variable"
                    ? `${p.minPrice || "-"} - ${p.maxPrice || "-"}`
                    : p.price || "-"}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {p.type === "simple" ? p.stock || 0 : "-"}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {p.category?.name || "—"}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/product/${p._id}/edit`}
                      title="Edit"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() => handleOpenDeleteModal(p)}
                      title="Delete"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
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

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${productToDelete?.name}"?`}
      />
    </div>
  );
}
