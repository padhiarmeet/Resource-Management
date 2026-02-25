"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
    User,
    Mail,
    Lock,
    Save,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Calendar,
    BookOpen,
    Archive,
    Building2,
    Clock,
    AlertCircle,
    Pencil,
    ShieldCheck,
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────────── */
interface UserData {
    userId: number;
    name: string;
    email: string;
    role: string;
}

interface Booking {
    booking_id: number;
    startDatetime: string;
    endDatetime: string;
    status: string;
    createdAt: string;
    resource?: {
        resource_id: number;
        resource_name: string;
        building?: { building_name: string };
        floor_number: number;
    };
    shelf?: {
        shelf_id: number;
        shelf_number: number;
        cupboard?: {
            cupboard_number: number;
            resource?: { resource_name: string };
        };
    };
}

/* ─── Helpers ───────────────────────────────────────────────── */
const API = "http://localhost:8080";

function formatDate(dt: string) {
    if (!dt) return "—";
    return new Date(dt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function statusBadge(status: string) {
    const map: Record<string, { bg: string; text: string }> = {
        PENDING: { bg: "bg-amber-100", text: "text-amber-700" },
        APPROVED: { bg: "bg-green-100", text: "text-green-700" },
        REJECTED: { bg: "bg-red-100", text: "text-red-700" },
        CANCELLED: { bg: "bg-slate-100", text: "text-slate-500" },
    };
    const s = map[status?.toUpperCase()] ?? { bg: "bg-slate-100", text: "text-slate-500" };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            {status ?? "Unknown"}
        </span>
    );
}

/* ─── Toast ─────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {msg}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "password" | "bookings" | "shelves">("profile");

    // Profile form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form state
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);

    // Bookings
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    // Toast
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

    /* Load user from localStorage */
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const u: UserData = JSON.parse(stored);
                setUser(u);
                setName(u.name ?? "");
                setEmail(u.email ?? "");
            }
        } catch {
            // ignore
        }
    }, []);

    /* Fetch bookings */
    const fetchBookings = useCallback(async () => {
        if (!user) return;
        setBookingsLoading(true);
        try {
            const res = await fetch(`${API}/api/bookings/user/${user.userId}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch {
            // ignore
        } finally {
            setBookingsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "bookings" || activeTab === "shelves") {
            fetchBookings();
        }
    }, [activeTab, fetchBookings]);

    /* ── Update Profile ────────────────────────────────────── */
    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setProfileLoading(true);
        try {
            const res = await fetch(`${API}/api/users/${user.userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, role: user.role }),
            });
            if (res.ok) {
                const updated = await res.json();
                const newUser = { ...user, name: updated.name ?? name, email: updated.email ?? email };
                setUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));
                showToast("Profile updated successfully!", "success");
            } else {
                const err = await res.text();
                showToast(err || "Failed to update profile.", "error");
            }
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setProfileLoading(false);
        }
    };

    /* ── Change Password ───────────────────────────────────── */
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (newPwd !== confirmPwd) {
            showToast("New passwords do not match.", "error");
            return;
        }
        if (newPwd.length < 6) {
            showToast("New password must be at least 6 characters.", "error");
            return;
        }
        setPwdLoading(true);
        try {
            const res = await fetch(`${API}/api/users/${user.userId}/change-password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
            });
            if (res.ok) {
                showToast("Password changed successfully!", "success");
                setCurrentPwd("");
                setNewPwd("");
                setConfirmPwd("");
            } else {
                const err = await res.text();
                showToast(err || "Failed to change password.", "error");
            }
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setPwdLoading(false);
        }
    };

    /* ── Filtered bookings ─────────────────────────────────── */
    const resourceBookings = bookings.filter((b) => b.resource != null);
    const shelfBookings = bookings.filter((b) => b.shelf != null);

    const getRoleBadgeColor = (role: string) => {
        const map: Record<string, string> = {
            ADMIN: "bg-purple-100 text-purple-700",
            FACULTY: "bg-blue-100 text-blue-700",
            STUDENT: "bg-green-100 text-green-700",
            MAINTENANCE: "bg-orange-100 text-orange-700",
        };
        return map[role?.toUpperCase()] ?? "bg-slate-100 text-slate-600";
    };

    const tabs = [
        { id: "profile", label: "Edit Profile", icon: Pencil },
        { id: "password", label: "Change Password", icon: ShieldCheck },
        { id: "bookings", label: "My Bookings", icon: BookOpen },
        { id: "shelves", label: "My Shelf Bookings", icon: Archive },
    ] as const;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Toast */}
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your account settings and view your bookings</p>
                </div>

                <div className="flex gap-6 flex-col lg:flex-row">
                    {/* ── Left: Profile Card ──────────────────────────────── */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-md mb-4">
                                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">{user?.name ?? "—"}</h2>
                            <p className="text-sm text-slate-500 mt-0.5">{user?.email ?? "—"}</p>
                            <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user?.role ?? "")}`}>
                                {user?.role ?? "Unknown"}
                            </span>

                            <div className="mt-6 w-full border-t border-slate-100 pt-5 flex flex-col gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="truncate">{user?.email ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-slate-400" />
                                    <span>ID: {user?.userId ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <StatCard label="Resources" value={resourceBookings.length} color="indigo" />
                            <StatCard label="Shelves" value={shelfBookings.length} color="violet" />
                            <StatCard label="Approved" value={bookings.filter(b => b.status === "APPROVED").length} color="green" />
                            <StatCard label="Pending" value={bookings.filter(b => b.status === "PENDING").length} color="amber" />
                        </div>
                    </aside>

                    {/* ── Right: Tabs ─────────────────────────────────────── */}
                    <div className="flex-1">
                        {/* Tab Nav */}
                        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <tab.icon size={15} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Profile Tab ────────────────────────────────── */}
                        {activeTab === "profile" && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="text-base font-semibold text-slate-800 mb-1">Personal Information</h3>
                                <p className="text-sm text-slate-500 mb-6">Update your display name and email address.</p>
                                <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                                    <FormField label="Full Name" icon={<User size={16} />}>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Your full name"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </FormField>

                                    <FormField label="Email Address" icon={<Mail size={16} />}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="Your email address"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </FormField>

                                    <FormField label="Role" icon={<ShieldCheck size={16} />}>
                                        <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed">
                                            {user?.role ?? "—"}
                                        </div>
                                    </FormField>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={profileLoading}
                                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                                        >
                                            <Save size={16} />
                                            {profileLoading ? "Saving…" : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── Password Tab ─────────────────────────────────── */}
                        {activeTab === "password" && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="text-base font-semibold text-slate-800 mb-1">Change Password</h3>
                                <p className="text-sm text-slate-500 mb-6">Choose a strong password to keep your account secure.</p>

                                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-700">
                                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                    You must enter your current password to set a new one.
                                </div>

                                <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
                                    <FormField label="Current Password" icon={<Lock size={16} />}>
                                        <div className="relative">
                                            <input
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPwd}
                                                onChange={(e) => setCurrentPwd(e.target.value)}
                                                required
                                                placeholder="Enter current password"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </FormField>

                                    <FormField label="New Password" icon={<Lock size={16} />}>
                                        <div className="relative">
                                            <input
                                                type={showNew ? "text" : "password"}
                                                value={newPwd}
                                                onChange={(e) => setNewPwd(e.target.value)}
                                                required
                                                placeholder="At least 6 characters"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </FormField>

                                    <FormField label="Confirm New Password" icon={<Lock size={16} />}>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                value={confirmPwd}
                                                onChange={(e) => setConfirmPwd(e.target.value)}
                                                required
                                                placeholder="Re-enter new password"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {confirmPwd && newPwd !== confirmPwd && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><XCircle size={12} /> Passwords do not match</p>
                                        )}
                                        {confirmPwd && newPwd === confirmPwd && (
                                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={12} /> Passwords match</p>
                                        )}
                                    </FormField>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={pwdLoading}
                                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                                        >
                                            <ShieldCheck size={16} />
                                            {pwdLoading ? "Updating…" : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── Bookings Tab ─────────────────────────────────── */}
                        {activeTab === "bookings" && (
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-800">Resource Bookings</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">All your room / lab / facility bookings</p>
                                </div>
                                {bookingsLoading ? (
                                    <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                                        <Clock size={18} className="animate-spin" />
                                        Loading bookings…
                                    </div>
                                ) : resourceBookings.length === 0 ? (
                                    <EmptyState icon={<BookOpen size={40} />} message="No resource bookings found." />
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {resourceBookings.map((b) => (
                                            <div key={b.booking_id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Building2 size={15} className="text-indigo-500 flex-shrink-0" />
                                                            <span className="font-semibold text-slate-800 text-sm truncate">
                                                                {b.resource?.resource_name ?? "Unknown Resource"}
                                                            </span>
                                                        </div>
                                                        {b.resource?.building && (
                                                            <p className="text-xs text-slate-500 ml-5">
                                                                {b.resource.building.building_name} · Floor {b.resource.floor_number}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 ml-5">
                                                            <Clock size={12} />
                                                            {formatDate(b.startDatetime)} → {formatDate(b.endDatetime)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {statusBadge(b.status)}
                                                        <span className="text-[11px] text-slate-400">#{b.booking_id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Shelf Bookings Tab ───────────────────────────── */}
                        {activeTab === "shelves" && (
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-800">Shelf / Cupboard Bookings</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">All your cupboard and shelf storage bookings</p>
                                </div>
                                {bookingsLoading ? (
                                    <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                                        <Clock size={18} className="animate-spin" />
                                        Loading bookings…
                                    </div>
                                ) : shelfBookings.length === 0 ? (
                                    <EmptyState icon={<Archive size={40} />} message="No shelf bookings found." />
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {shelfBookings.map((b) => (
                                            <div key={b.booking_id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Archive size={15} className="text-violet-500 flex-shrink-0" />
                                                            <span className="font-semibold text-slate-800 text-sm">
                                                                Shelf #{b.shelf?.shelf_number ?? "?"}
                                                            </span>
                                                        </div>
                                                        {b.shelf?.cupboard && (
                                                            <p className="text-xs text-slate-500 ml-5">
                                                                Cupboard #{b.shelf.cupboard.cupboard_number}
                                                                {b.shelf.cupboard.resource?.resource_name
                                                                    ? ` · ${b.shelf.cupboard.resource.resource_name}`
                                                                    : ""}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 ml-5">
                                                            <Clock size={12} />
                                                            {formatDate(b.startDatetime)} → {formatDate(b.endDatetime)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {statusBadge(b.status)}
                                                        <span className="text-[11px] text-slate-400">#{b.booking_id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ─── Sub-components ────────────────────────────────────────── */
function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                {icon}
                {label}
            </label>
            {children}
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "indigo" | "violet" | "green" | "amber" }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        violet: "bg-violet-50 text-violet-700 border-violet-100",
        green: "bg-green-50 text-green-700 border-green-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
    };
    return (
        <div className={`rounded-xl border p-3 text-center ${colors[color]}`}>
            <div className="text-xl font-bold">{value}</div>
            <div className="text-[11px] font-medium mt-0.5">{label}</div>
        </div>
    );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <div className="text-slate-300">{icon}</div>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
