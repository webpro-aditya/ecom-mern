import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {  FirstPageIcon, PreviousPageIcon, NextPageIcon, LastPageIcon } from '../../../icons';

// Icons
const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500 hover:text-blue-700 transition"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 20h9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 3.5a2.121 2.121 0 113 3l-12 12-4 1 1-4 12-12z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-500 hover:text-red-700 transition"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m5 0H4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

interface User {
  id: number;
  _id?: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  status?: string;
}

interface BasicTableOneProps {
  data: User[];
  loading?: boolean;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // Pagination props
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function BasicTableOne({
  data = [],
  loading = false,
  onSort,
  sortBy,
  sortOrder = "asc",
  page = 1,
  totalPages = 1,
  onPageChange,
}: BasicTableOneProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-gray-500">No users found</span>
      </div>
    );
  }

  // Helper for sortable header cells
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableCell
      isHeader
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={() => onSort?.(field)}
    >
      <div className="flex items-center">
        {children}
        {onSort && <SortIcon active={sortBy === field} direction={sortOrder} />}
      </div>
    </TableCell>
  );

  // Build smart pagination items: 1 … [p-1, p, p+1] … total
  const getPageItems = () => {
    const items: Array<number | "ellipsis-left" | "ellipsis-right"> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    const showLeftEllipsis = page > 3;
    const showRightEllipsis = page < totalPages - 2;

    items.push(1);

    if (showLeftEllipsis) items.push("ellipsis-left");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let p = start; p <= end; p++) items.push(p);

    if (showRightEllipsis) items.push("ellipsis-right");

    items.push(totalPages);

    return items;
  };

  const go = (p: number) => {
    if (!onPageChange) return;
    if (p < 1 || p > (totalPages || 1)) return;
    onPageChange(p);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <SortableHeader field="name">User</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="role">Role</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((user) => (
              <TableRow key={user.id || user._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                      {user.image ? (
                        <img
                          width={40}
                          height={40}
                          src={user.image}
                          alt={user.name}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      user.status?.toLowerCase() === "active"
                        ? "success"
                        : user.status?.toLowerCase() === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.status || "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/users/${user._id || user.id}/edit`}
                      className="p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                      title="Edit"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950 transition"
                      onClick={() => {
                        // handleDelete(user._id || user.id)
                      }}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {/* Summary Text */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => go(1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to first page"
            >
              <FirstPageIcon />
            </button>
            <button
              onClick={() => go(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to previous page"
            >
              <PreviousPageIcon />
            </button>

            {/* Numbered Page Buttons */}
            {getPageItems().map((item, idx) => {
              if (typeof item === "number") {
                const active = item === page;
                return (
                  <button
                    key={`page-${item}`}
                    onClick={() => go(item)}
                    className={`flex items-center justify-center h-9 w-9 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item}
                  </button>
                );
              }
              // Ellipsis
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex items-center justify-center h-9 w-9 select-none text-slate-500 dark:text-slate-400"
                >
                  …
                </span>
              );
            })}

            <button
              onClick={() => go(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to next page"
            >
              <NextPageIcon />
            </button>
            <button
              onClick={() => go(totalPages)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Go to last page"
            >
              <LastPageIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
