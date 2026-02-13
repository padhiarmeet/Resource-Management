"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
    fetchMaintenance,
    fetchResources,
    fetchBuildings,
    createMaintenance,
    deleteMaintenance,
    updateMaintenanceStatus,
    updateMaintenanceNotes,
    MaintenancePayload,
} from "@/lib/api";
import {
    Wrench,
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    Building2,
    Box,
    AlertCircle,
    CheckCircle2,
    Clock,
    X,
    CalendarDays,
    StickyNote,
    Layout,
    List as ListIcon,
    Edit3,
    MoreHorizontal,
    ArrowRightCircle,
} from "lucide-react";

// ─── Types ───

interface MaintenanceRecord {
    maintenance_id: number;
    maintenance_type: string;
    scheduled_date: string;
    status: string;
    notes: string;
    resource: {
        resource_id: number;
        resource_name: string;
        building: {
            building_id: number;
            building_name: string;
            building_number: string;
        };
        floor_number: number;
        description: string;
        resourceType: {
            type_id: number;
            type_name: string;
        };
    };
}

interface ResourceItem {
    resource_id: number;
    resource_name: string;
    building: { building_id: number; building_name: string; building_number: string };
    floor_number: number;
    description: string;
    resourceType: { type_id: number; type_name: string };
}

interface BuildingItem {
    building_id: number;
    building_name: string;
    building_number: string;
    total_floors: number;
}

// ─── Grouped Data Types ───

interface GroupedResource {
    resource: ResourceItem;
    records: MaintenanceRecord[];
}

interface GroupedBuilding {
    building: BuildingItem;
    resources: GroupedResource[];
    totalRecords: number;
}

// ─── Status Badge ───

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
        PENDING: { bg: "bg-amber-50", text: "text-amber-700", icon: <Clock size={12} /> },
        "IN PROGRESS": { bg: "bg-blue-50", text: "text-blue-700", icon: <Wrench size={12} /> },
        IN_PROGRESS: { bg: "bg-blue-50", text: "text-blue-700", icon: <Wrench size={12} /> },
        COMPLETED: { bg: "bg-green-50", text: "text-green-700", icon: <CheckCircle2 size={12} /> },
    };
    const c = config[status] || { bg: "bg-slate-50", text: "text-slate-600", icon: <AlertCircle size={12} /> };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
            {c.icon}
            {status}
        </span>
    );
};

// ─── Create Modal ───

interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (payload: MaintenancePayload) => Promise<void>;
    buildings: BuildingItem[];
    resources: ResourceItem[];
}

const CreateModal: React.FC<CreateModalProps> = ({ open, onClose, onSubmit, buildings, resources }) => {
    const [selectedBuilding, setSelectedBuilding] = useState<number | "">("");
    const [selectedResource, setSelectedResource] = useState<number | "">("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const filteredResources = selectedBuilding
        ? resources.filter(r => r.building.building_id === selectedBuilding)
        : [];

    const resetForm = () => {
        setSelectedBuilding("");
        setSelectedResource("");
        setType("");
        setDate("");
        setNotes("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedResource || !type || !date) return;
        setSubmitting(true);
        try {
            await onSubmit({
                resource_id: selectedResource as number,
                maintenance_type: type,
                scheduled_date: date,
                notes,
            });
            resetForm();
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Wrench size={16} className="text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">New Maintenance Record</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Building Select */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Building</label>
                        <select
                            value={selectedBuilding}
                            onChange={e => {
                                setSelectedBuilding(Number(e.target.value) || "");
                                setSelectedResource("");
                            }}
                            required
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select Building</option>
                            {buildings.map(b => (
                                <option key={b.building_id} value={b.building_id}>
                                    {b.building_name} ({b.building_number})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Resource Select */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resource</label>
                        <select
                            value={selectedResource}
                            onChange={e => setSelectedResource(Number(e.target.value) || "")}
                            required
                            disabled={!selectedBuilding}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {selectedBuilding ? "Select Resource" : "Select a building first"}
                            </option>
                            {filteredResources.map(r => (
                                <option key={r.resource_id} value={r.resource_id}>
                                    {r.resource_name} — Floor {r.floor_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maintenance Type</label>
                        <input
                            type="text"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            required
                            placeholder="e.g. Electrical Repair, AC Servicing"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Scheduled Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Additional details..."
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedResource || !type || !date}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating..." : "Create Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Edit Notes Modal ───

interface EditNotesModalProps {
    open: boolean;
    record: MaintenanceRecord | null;
    onClose: () => void;
    onSubmit: (id: number, notes: string) => Promise<void>;
}

const EditNotesModal: React.FC<EditNotesModalProps> = ({ open, record, onClose, onSubmit }) => {
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (record) {
            setNotes(record.notes || "");
        }
    }, [record]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!record) return;
        setSubmitting(true);
        try {
            await onSubmit(record.maintenance_id, notes);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    if (!open || !record) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Update Notes</h3>
                    <button onClick={onClose}><X size={18} className="text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add resolution notes or updates..."
                        rows={5}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
                    />
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50">
                            {submitting ? "Saving..." : "Save Notes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete Confirmation Modal ───

interface DeleteModalProps {
    open: boolean;
    record: MaintenanceRecord | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, record, onClose, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);

    if (!open || !record) return null;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onConfirm();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <Trash2 size={22} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Record?</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        This will permanently delete the <strong>{record.maintenance_type}</strong> record
                        for <strong>{record.resource.resource_name}</strong>.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Skeleton Loader ───

const SkeletonAccordion = () => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
        <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg" />
            <div className="flex-1">
                <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
        </div>
    </div>
);

// ─── Main Page ───

export default function MaintenancePage() {
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [buildings, setBuildings] = useState<BuildingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "board">("list");
    const [userRole, setUserRole] = useState("ADMIN");

    // Accordion state
    const [expandedBuildings, setExpandedBuildings] = useState<Set<number>>(new Set());
    const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

    // Modals
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MaintenanceRecord | null>(null);
    const [editNotesOpen, setEditNotesOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<MaintenanceRecord | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [mData, rData, bData] = await Promise.all([
                fetchMaintenance(),
                fetchResources(),
                fetchBuildings(),
            ]);
            setMaintenance(mData || []);
            setResources(rData || []);
            setBuildings(bData || []);
        } catch (err) {
            console.error("Failed to load maintenance page data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const u = JSON.parse(stored);
            setUserRole(u.role?.toUpperCase() || "ADMIN");
            if (u.role?.toUpperCase() === "MAINTENANCE") {
                setViewMode("board");
            }
        }
        loadData();
    }, [loadData]);

    // ─── Helper Functions ───

    const handleCreate = async (payload: MaintenancePayload) => {
        await createMaintenance(payload);
        await loadData();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteMaintenance(deleteTarget.maintenance_id);
        setDeleteOpen(false);
        setDeleteTarget(null);
        await loadData();
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        await updateMaintenanceStatus(id, newStatus);
        await loadData();
    };

    const handleUpdateNotes = async (id: number, notes: string) => {
        await updateMaintenanceNotes(id, notes);
        await loadData();
    };

    // ─── Group Data for List View ───

    const grouped: GroupedBuilding[] = React.useMemo(() => {
        const map = new Map<number, GroupedBuilding>();
        buildings.forEach(b => {
            map.set(b.building_id, { building: b, resources: [], totalRecords: 0 });
        });
        maintenance.forEach(m => {
            const bId = m.resource?.building?.building_id;
            if (!bId) return;
            if (!map.has(bId)) {
                map.set(bId, {
                    building: m.resource.building as BuildingItem & { total_floors: number },
                    resources: [],
                    totalRecords: 0,
                });
            }
            const group = map.get(bId)!;
            group.totalRecords++;
            let resGroup = group.resources.find(rg => rg.resource.resource_id === m.resource.resource_id);
            if (!resGroup) {
                resGroup = { resource: m.resource as unknown as ResourceItem, records: [] };
                group.resources.push(resGroup);
            }
            resGroup.records.push(m);
        });
        return Array.from(map.values()).sort((a, b) => b.totalRecords - a.totalRecords);
    }, [buildings, maintenance]);

    // ─── Toggles ───

    const toggleBuilding = (id: number) => {
        setExpandedBuildings(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const toggleResource = (key: string) => {
        setExpandedResources(prev => {
            const s = new Set(prev);
            s.has(key) ? s.delete(key) : s.add(key);
            return s;
        });
    };

    // ─── Kanban Board View ───

    const KanbanColumn = ({ title, status, records, color }: { title: string, status: string, records: MaintenanceRecord[], color: string }) => (
        <div className="flex-1 min-w-[300px] flex flex-col h-full bg-slate-100/50 rounded-2xl border border-slate-200">
            <div className={`p-4 border-b border-slate-200 flex items-center justify-between rounded-t-2xl ${color}`}>
                <h3 className="font-bold text-slate-700">{title}</h3>
                <span className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full text-slate-600">{records.length}</span>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {records.map(rec => (
                    <div key={rec.maintenance_id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{rec.resource.building.building_name}</span>
                            <div className="relative">
                                {/* Simple Status Dropdown */}
                                <select
                                    value={rec.status}
                                    onChange={(e) => handleUpdateStatus(rec.maintenance_id, e.target.value)}
                                    className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 ring-indigo-500 cursor-pointer"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{rec.maintenance_type}</h4>
                        <p className="text-xs text-slate-500 mb-3">{rec.resource.resource_name} • Floor {rec.resource.floor_number}</p>

                        {rec.notes && (
                            <div className="bg-amber-50 p-2 rounded-lg mb-3 border border-amber-100">
                                <p className="text-xs text-amber-800 italic flex items-start gap-1">
                                    <StickyNote size={10} className="mt-0.5 shrink-0" />
                                    {rec.notes}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <CalendarDays size={12} />
                                {rec.scheduled_date}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => { setEditTarget(rec); setEditNotesOpen(true); }}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Edit Notes"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => { setDeleteTarget(rec); setDeleteOpen(true); }}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ─── Stats ───
    const totalRecords = maintenance.length;
    const pendingCount = maintenance.filter(m => m.status === "PENDING").length;
    const completedCount = maintenance.filter(m => m.status === "COMPLETED").length;

    return (
        <div className="h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-[1600px] mx-auto p-8 h-full flex flex-col">

                        <DashboardHeader />

                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Maintenance</h1>
                                <p className="text-slate-500 mt-1">Manage tasks, update status, and track repairs.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                        title="List View"
                                    >
                                        <ListIcon size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("board")}
                                        className={`p-2 rounded-lg transition-all ${viewMode === "board" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                        title="Board View"
                                    >
                                        <Layout size={20} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setCreateOpen(true)}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
                                >
                                    <Plus size={20} />
                                    <span className="hidden sm:inline">Add Task</span>
                                </button>
                            </div>
                        </div>

                        {/* Summary Stats (Only in List View or if needed) */}
                        {viewMode === "list" && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 shrink-0">
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                        <Wrench size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-semibold uppercase">Total Records</div>
                                        <div className="text-xl font-bold text-slate-800">{loading ? "—" : totalRecords}</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <Clock size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-semibold uppercase">Pending</div>
                                        <div className="text-xl font-bold text-slate-800">{loading ? "—" : pendingCount}</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                        <CheckCircle2 size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 font-semibold uppercase">Completed</div>
                                        <div className="text-xl font-bold text-slate-800">{loading ? "—" : completedCount}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content Area */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(n => <SkeletonAccordion key={n} />)}
                            </div>
                        ) : viewMode === "list" ? (
                            <div className="space-y-4 pb-8">
                                {grouped.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-slate-200 border-dashed rounded-xl">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <Building2 className="text-slate-300" size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700">No records found</h3>
                                        <p className="text-slate-400 mt-1 max-w-sm">Create a new task to get started.</p>
                                    </div>
                                ) : (
                                    grouped.map(({ building, resources: resGroups, totalRecords: bTotal }) => {
                                        const isExpanded = expandedBuildings.has(building.building_id);
                                        return (
                                            <div key={building.building_id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                {/* Building Header */}
                                                <button
                                                    onClick={() => toggleBuilding(building.building_id)}
                                                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                                                        <Building2 size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-slate-800">{building.building_name}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {building.building_number} • {building.total_floors || "?"} floors
                                                        </div>
                                                    </div>
                                                    {bTotal > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">{bTotal}</span>}
                                                    {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                                                </button>
                                                {/* Building Body */}
                                                {isExpanded && (
                                                    <div className="border-t border-slate-100">
                                                        {resGroups.map(({ resource, records }) => {
                                                            const rKey = `${building.building_id}-${resource.resource_id}`;
                                                            const isResExpanded = expandedResources.has(rKey);
                                                            return (
                                                                <div key={rKey}>
                                                                    <button
                                                                        onClick={() => toggleResource(rKey)}
                                                                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-50/50 transition-colors text-left"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                                            <Box size={16} className="text-slate-500" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <span className="font-semibold text-sm text-slate-700">{resource.resource_name}</span>
                                                                        </div>
                                                                        <span className="text-xs text-slate-500 font-medium">{records.length}</span>
                                                                        {isResExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                                                    </button>
                                                                    {isResExpanded && (
                                                                        <div className="px-6 pb-4 space-y-2">
                                                                            {records.map(rec => (
                                                                                <div key={rec.maintenance_id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                                            <span className="font-semibold text-sm text-slate-800">{rec.maintenance_type}</span>
                                                                                            <StatusBadge status={rec.status} />
                                                                                        </div>
                                                                                        <div className="text-xs text-slate-500 mt-1">{rec.scheduled_date} {rec.notes || ""}</div>
                                                                                    </div>
                                                                                    <button onClick={() => { setDeleteTarget(rec); setDeleteOpen(true); }} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                                                                                        <Trash2 size={14} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        ) : (
                            /* Board View */
                            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                                <div className="flex h-full gap-6 min-w-[1000px]">
                                    <KanbanColumn
                                        title="To Do / Pending"
                                        status="PENDING"
                                        records={maintenance.filter(m => m.status === "PENDING" || !m.status)}
                                        color="bg-amber-50/50"
                                    />
                                    <KanbanColumn
                                        title="In Progress"
                                        status="IN_PROGRESS"
                                        records={maintenance.filter(m => m.status === "IN_PROGRESS" || m.status === "IN PROGRESS")}
                                        color="bg-blue-50/50"
                                    />
                                    <KanbanColumn
                                        title="Completed"
                                        status="COMPLETED"
                                        records={maintenance.filter(m => m.status === "COMPLETED")}
                                        color="bg-green-50/50"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Modals */}
            <CreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                buildings={buildings}
                resources={resources}
            />
            <DeleteModal
                open={deleteOpen}
                record={deleteTarget}
                onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
                onConfirm={handleDelete}
            />
            <EditNotesModal
                open={editNotesOpen}
                record={editTarget}
                onClose={() => { setEditNotesOpen(false); setEditTarget(null); }}
                onSubmit={handleUpdateNotes}
            />
        </div>
    );
}
