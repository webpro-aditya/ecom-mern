import { Link } from "react-router-dom";

// Use your StatusBadge from previous answers for consistent status colors
import { StatusBadge } from "../badges/StatusBadge";
import SkeletonRow from "../common/SkeletonRow";

export default function OrdersTable({
  orders,
  loading,
  sortBy,
  sortOrder,
  onSort
}: {
  orders: any[];
  loading: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}) {
  return (
    <div className="p-0 overflow-x-auto">
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-slate-600 dark:text-slate-400">No orders found.</div>
      ) : (
        <table className="w-full min-w-[800px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <th className="px-5 py-2 cursor-pointer" onClick={() => onSort('orderNumber')}>Order No.</th>
              <th className="px-5 py-2 cursor-pointer" onClick={() => onSort('user.name')}>Customer</th>
              <th className="px-5 py-2 cursor-pointer" onClick={() => onSort('createdAt')}>Placed On</th>
              <th className="px-5 py-2">Status</th>
              <th className="px-5 py-2">Total</th>
              <th className="px-5 py-2">Items</th>
              <th className="px-5 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="group bg-white hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950/60 border rounded">
                <td className="px-5 py-4 font-medium text-blue-700 dark:text-blue-300">
                  {order.orderNumber || order._id.substring(0, 7).toUpperCase()}
                </td>
                <td className="px-5 py-4">
                  <span className="block text-slate-900 dark:text-slate-50">{order.user?.name || "—"}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{order.user?.email}</span>
                </td>
                <td className="px-5 py-4 text-slate-700 dark:text-slate-200">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {order.currency || "₹"}{order.totalAmount?.toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-4 max-w-xs truncate">
                  <ul className="list-inside list-disc text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    {order.items && order.items.length
                      ? order.items.map((item: any, idx: number) => (
                          <li key={idx}>
                            <span className="font-medium">{item.name}</span> × {item.quantity}
                          </li>
                        ))
                      : <li>—</li>}
                  </ul>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
