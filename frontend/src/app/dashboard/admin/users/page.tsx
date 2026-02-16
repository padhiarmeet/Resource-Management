"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
    Users,
    UserPlus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    Shield,
    GraduationCap,
    School, // Replaced ChalkboardTeacher with School or similar appropriate icon
    X,
    Loader2,
    CheckCircle2,
    Lock
} from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser, User } from "@/lib/api";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isdataLoading, setIsDataLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "STUDENT",
        password: "",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: users.length,
        faculty: users.filter(u => u.role === "FACULTY").length,
        students: users.filter(u => u.role === "STUDENT").length,
        admins: users.filter(u => u.role === "ADMIN").length,
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: "", // Don't populate password
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: "",
                email: "",
                role: "STUDENT",
                password: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDataLoading(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.user_id, formData);
            } else {
                await createUser(formData);
            }
            await loadUsers();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save user:", error);
            alert("Failed to save user. Please try again.");
        } finally {
            setIsDataLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-8">
                    <DashboardHeader
                        title="User Management"
                        subtitle="Manage user accounts, roles, and permissions."
                    />

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard label="Total Users" value={stats.total} icon={Users} color="blue" />
                        <StatCard label="Faculty" value={stats.faculty} icon={School} color="indigo" />
                        <StatCard label="Students" value={stats.students} icon={GraduationCap} color="emerald" />
                        <StatCard label="Admins" value={stats.admins} icon={Shield} color="amber" />
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-64"
                                />
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                <UserPlus size={18} />
                                Add User
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Loading users...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.user_id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-slate-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleOpenModal(user)}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.user_id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="john@university.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="FACULTY">Faculty</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    {editingUser ? "New Password (optional)" : "Password"}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        placeholder={editingUser ? "Leave blank to keep current" : "••••••••"}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isdataLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isdataLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingUser ? "Save Changes" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
    };

    return (
        <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        ADMIN: "bg-amber-50 text-amber-700 border-amber-100",
        FACULTY: "bg-indigo-50 text-indigo-700 border-indigo-100",
        STUDENT: "bg-emerald-50 text-emerald-700 border-emerald-100",
        MAINTENANCE: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[role] || styles.STUDENT}`}>
            {role}
        </span>
    );
}
