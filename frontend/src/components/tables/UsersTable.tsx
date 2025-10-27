import { useState } from 'react';
import { Link } from "react-router-dom";
import Badge from "../../components/ui/badge/Badge";
import { EditIcon, DeleteIcon } from "../../icons";
import ConfirmationModal from '../common/ConfirmationModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status?: string;
}

interface UsersTableProps {
  users: User[];
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

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-4">
      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
    </td>
    <td className="p-4">
      <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
    </td>
    <td className="p-4">
      <div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
    </td>
  </tr>
);

export default function UsersTable({
  users,
  loading,
  onSort,
  sortBy,
  sortOrder,
  onDelete,
}: UsersTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    
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

   const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await onDelete(userToDelete._id);
      handleCloseModal();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
              Name
            </th>
            <SortableHeader field="email">Email</SortableHeader>
            <SortableHeader field="role">Role</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="createdAt">Date Added</SortableHeader>
            <th className="p-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-10 text-slate-500 dark:text-slate-400"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-medium text-slate-500">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {user.email}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 capitalize">
                  {user.role}
                </td>
                <td className="p-4">
                  <Badge
                    color={user.status === "active" ? "success" : "warning"}
                  >
                    {user.status || "Pending"}
                  </Badge>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {/* Add EditIcon and DeleteIcon components here */}
                    <Link to={`/admin/users/${user._id}/edit`} title="Edit" className="p-1.5">
                      <EditIcon />
                    </Link>
                     <button 
                        onClick={() => handleOpenDeleteModal(user)} 
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
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
