import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { StatusBadge } from "../../components/badges/StatusBadge";

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface OrderItem {
  product?: string | null;
  variationId?: string | null;
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

interface OrderDetails {
  _id: string;
  status: string;
  shippingAddress: ShippingAddress;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  stockDeducted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SingleOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}user/order/${id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok || !data.orders?.length)
          throw new Error(data.message || "Order not found");
        setOrder(data.orders[0]);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <>
      <PageMeta title="Order Details | Admin Dashboard" />
      <PageBreadcrumb
        pageTitle="Order Details"
        parent="Orders"
        parentUrl="/admin/orders"
      />

      <div className="mx-auto max-w-4xl">
        <ComponentCard>
          <div className="p-6 md:p-8">
            {loading ? (
              <div className="text-center text-slate-500 dark:text-slate-400">
                Loading order details...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-center">
                {error}
              </div>
            ) : !order ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Order not found.
              </div>
            ) : (
              <>
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Order #{order._id.substring(0, 7).toUpperCase()}
                    </h2>
                    <div className="flex items-center gap-3 text-sm dark:text-white">
                      <span>
                        Placed on:{" "}
                        <span className="font-medium text-slate-800 dark:text-white">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                    {order.paymentMethod && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Payment: {order.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipping/Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Shipping Address</h3>
                    <div className="text-slate-800 dark:text-slate-200 flex flex-col gap-1">
                      <span>{order.shippingAddress.fullName}</span>
                      <span>{order.shippingAddress.address}</span>
                      <span>
                        {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zip}
                      </span>
                      <span>{order.shippingAddress.country}</span>
                      <span>Phone: {order.shippingAddress.phone}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Order Info</h3>
                    <div className="text-slate-800 dark:text-slate-200 flex flex-col gap-1">
                      <span>
                        Status: <StatusBadge status={order.status} />
                      </span>
                      {order.paymentMethod && (
                        <span>
                          Payment Method: <span className="font-medium">{order.paymentMethod}</span>
                        </span>
                      )}
                      <span>
                        Stock Deducted:{" "}
                        <span className={order.stockDeducted ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-400"}>
                          {order.stockDeducted ? "Yes" : "No"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Order Items
                  </h3>
                  {!order.items?.length ? (
                    <div className="text-slate-500 dark:text-slate-400 italic">
                      No items found in this order.
                    </div>
                  ) : (
                    <div className="overflow-auto">
                      <table className="w-full min-w-[500px] border-separate border-spacing-y-2">
                        <thead>
                          <tr className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            <th className="px-3 py-2 text-left bg-slate-50 dark:bg-slate-900">Product</th>
                            <th className="px-3 py-2 text-left bg-slate-50 dark:bg-slate-900">Qty</th>
                            <th className="px-3 py-2 text-left bg-slate-50 dark:bg-slate-900">Price</th>
                            <th className="px-3 py-2 text-left bg-slate-50 dark:bg-slate-900">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item._id} className="group bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-blue-950/60 border rounded">
                              <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                              <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.quantity}</td>
                              <td className="px-3 py-2 text-slate-700 dark:text-slate-200">₹{item.price?.toFixed(2)}</td>
                              <td className="px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Back to Orders
                  </Link>
                </div>
              </>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
