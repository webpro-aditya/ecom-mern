import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Preloader from "../../components/ui/Preloader";
import { RootState } from "../../store";
import { toast } from "react-hot-toast";

const AccountAddressesPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [addrLine, setAddrLine] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [setDefault, setSetDefault] = useState(true);

  const baseInput = "w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const fetchAddresses = async () => {
    setLoading(true);
    setError("");
    try {
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${base}user/addresses`, { method: "GET", credentials: "include", headers });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch addresses");
      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, [token]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!fullName || !addrLine || !city || !stateName || !zip || !country) {
        toast.error("Please fill all required fields");
        setSaving(false);
        return;
      }
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
      const csrfToken = match ? decodeURIComponent(match[1]) : "";
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
      const res = await fetch(`${base}user/address`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          fullName,
          address: addrLine,
          city,
          state: stateName,
          zip,
          country,
          phone,
          isDefault: setDefault,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to add address");
      toast.success("Address saved");
      setFullName(""); setAddrLine(""); setCity(""); setStateName(""); setZip(""); setCountry(""); setPhone(""); setSetDefault(false);
      setAddresses(data.addresses || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleMakeDefault = async (id: string) => {
    setSaving(true);
    try {
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
      const csrfToken = match ? decodeURIComponent(match[1]) : "";
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
      const res = await fetch(`${base}user/address/${id}/default`, { method: "PUT", credentials: "include", headers });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to set default");
      toast.success("Default address updated");
      setAddresses(data.addresses || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to set default");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
      const csrfToken = match ? decodeURIComponent(match[1]) : "";
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
      const res = await fetch(`${base}user/address/${id}`, { method: "DELETE", credentials: "include", headers });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");
      toast.success("Address deleted");
      setAddresses(data.addresses || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta
        title="My Addresses | EcomPro"
        description="Manage your addresses at EcomPro"
      />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="My Addresses" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Addresses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center"><Preloader /></div>
          )}
          {!loading && error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-md dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Saved Addresses</h3>

            {addresses.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No addresses saved.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((a) => (
                  <div key={a._id} className="border rounded-lg p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{a.fullName}</p>
                        <p className="text-gray-600 dark:text-gray-300">{a.address}</p>
                        <p className="text-gray-600 dark:text-gray-300">{a.city}, {a.state} {a.zip}</p>
                        <p className="text-gray-600 dark:text-gray-300">{a.country}</p>
                        {a.phone && (<p className="text-gray-600 dark:text-gray-300">{a.phone}</p>)}
                      </div>
                      {a.isDefault && (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">Default</span>
                      )}
                    </div>
                    <div className="mt-4 flex gap-3">
                      {!a.isDefault && (
                        <button onClick={() => handleMakeDefault(a._id)} className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600">
                          Make Default
                        </button>
                      )}
                      <button onClick={() => handleDelete(a._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADD ADDRESS CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Add New Address
            </h3>
            <form className="space-y-3" onSubmit={handleAddAddress}>
              <input className={baseInput} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input className={baseInput} placeholder="Address Line" value={addrLine} onChange={(e) => setAddrLine(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input className={baseInput} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className={baseInput} placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={baseInput} placeholder="Postal Code" value={zip} onChange={(e) => setZip(e.target.value)} />
                <input className={baseInput} placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <input className={baseInput} placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input type="checkbox" checked={setDefault} onChange={(e) => setSetDefault(e.target.checked)} /> Set as default
              </label>
              <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Save Address</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAddressesPage;
