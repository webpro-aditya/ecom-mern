import { useState } from 'react';
import { Link } from "react-router-dom";
import Badge from "../../components/ui/badge/Badge";
import { EditIcon, DeleteIcon } from "../../icons";
import ConfirmationModal from '../common/ConfirmationModal';
import SkeletonRow from "../common/SkeletonRow";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent?: string;
  createdAt?: string;
}

interface CategoriesTableProps {
  categories: Category[];
  loading: boolean;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onDelete: (userId: string) => Promise<void>;
}

const SortIcon = ({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) => (
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

export default function CategoriesTable({
  categories,
  loading,
  onSort,
  sortBy,
  sortOrder,
  onDelete,
}: CategoriesTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <th
      className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon active={sortBy === field} direction={sortOrder} />
      </div>
    </th>
  );

   const handleOpenDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await onDelete(categoryToDelete._id);
      handleCloseModal();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <SortableHeader field="name">Name</SortableHeader>
            <SortableHeader field="slug">Slug</SortableHeader>
            <SortableHeader field="description">Description</SortableHeader>
            <SortableHeader field="parent">Parent</SortableHeader>
            <SortableHeader field="createdAt">Date Added</SortableHeader>
            <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-10 text-slate-500 dark:text-slate-400"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr
                key={category._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {category.slug}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {category.description}
                </td>
                <td className="p-4">
                  {category.parent?.name}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {/* Add EditIcon and DeleteIcon components here */}
                    <Link to={`/admin/category/${category._id}/edit`} title="Edit" className="p-1.5">
                      <EditIcon />
                    </Link>
                     {/* <button 
                        onClick={() => handleOpenDeleteModal(category)} 
                        title="Delete"
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <DeleteIcon />
                      </button> */}
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
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
