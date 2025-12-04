import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { RootState, AppDispatch } from "../../store";
import { fetchUser } from "../../store/userSlice";
import { toast } from "react-hot-toast";
import Preloader from "../../components/ui/Preloader";

const AccountProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pwCurrentError, setPwCurrentError] = useState("");
  const [pwConfirmError, setPwConfirmError] = useState("");
  const [profileError, setProfileError] = useState("");
  const baseInput = "w-full h-11 px-3 border rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2";

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${base}auth/me`, { method: "GET", credentials: "include", headers });
        const data = await res.json();
        if (res.ok && data) {
          setName(data.name || data.user?.name || "");
          setEmail(data.email || data.user?.email || "");
          setPhone(data.phone || data.user?.phone || "");
        } else if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone((user as any).phone || "");
        }
      } catch {
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone((user as any).phone || "");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setPwCurrentError("");
    setPwConfirmError("");
    setProfileError("");
    try {
      const base = import.meta.env.PROD ? `${window.location.origin}/api/` : `${import.meta.env.VITE_API_URL}`;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const csrfMatch = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
      const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : "";
      if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
      const isPasswordChange = Boolean(currentPassword || newPassword || confirmNewPassword);
      if (newPassword || confirmNewPassword || currentPassword) {
        if (!currentPassword) {
          setPwCurrentError("Please enter current password");
          throw new Error("Please enter current password");
        }
        if (!newPassword || !confirmNewPassword) {
          setPwConfirmError("Please enter and confirm new password");
          throw new Error("Please enter and confirm new password");
        }
        if (newPassword !== confirmNewPassword) {
          setPwConfirmError("New passwords do not match");
          throw new Error("New passwords do not match");
        }
      }
      const res = await fetch(`${base}auth/me`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({ name, email, phone, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Update failed";
        if (msg.includes("Incorrect current password") || msg.includes("Current password required")) {
          setPwCurrentError(msg);
        } else if (msg.includes("Email already in use")) {
          setProfileError(msg);
        }
        throw new Error(msg);
      }
      toast.success(isPasswordChange ? "Password updated" : "Profile updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      dispatch(fetchUser());
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PageMeta title="Account Profile | EcomPro" description="Manage your profile at EcomPro" />

      <div className="container mx-auto px-6 py-10">
        <PageBreadcrumb pageTitle="Account Profile" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Profile</h1>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Preloader /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {saving && (
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
                <Preloader />
              </div>
            )}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Personal Information</h3>

              <form className="space-y-3" onSubmit={handleSave}>
              <input
                className={`${baseInput} focus:ring-blue-500`}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={`${baseInput} ${profileError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {profileError && (
                <div className="mt-1 text-sm px-3 py-2 rounded-md border bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                  {profileError}
                </div>
              )}
              <input
                className={`${baseInput} focus:ring-blue-500`}
                placeholder="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                Save Changes
              </button>
              </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 dark:text-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Change Password</h3>

            <form className="space-y-3" onSubmit={handleSave}>
              <input
                className={`${baseInput} ${pwCurrentError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {pwCurrentError && (
                <div className="mt-1 text-sm px-3 py-2 rounded-md border bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                  {pwCurrentError}
                </div>
              )}
              <input
                className={`${baseInput} ${pwConfirmError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className={`${baseInput} ${pwConfirmError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                placeholder="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {pwConfirmError && (
                <div className="mt-1 text-sm px-3 py-2 rounded-md border bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                  {pwConfirmError}
                </div>
              )}
              <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                Update Password
              </button>
            </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountProfilePage;
