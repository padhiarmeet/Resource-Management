"use client";

import React, { useState } from "react";
import {
    X,
    CalendarClock,
    MapPin,
    UserCircle2,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { updateBookingStatus, deleteBooking } from "@/lib/api";

interface Booking {
    booking_id: number;
    startDatetime: string;
    endDatetime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    user?: { user_id: number; name: string };
    resource?: {
        resource_id: number;
        resource_name: string;
        floor_number?: number;
        building?: { building_name: string };
        resourceType?: { type_name: string };
    };
}

interface BookingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onUpdated: () => void; // callback to refresh the timetable
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    isOpen,
    onClose,
    booking,
    onUpdated,
}) => {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [actionDone, setActionDone] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Check user role on mount
    React.useEffect(() => {
        if (isOpen) {
            try {
                const stored = localStorage.getItem("user");
                if (stored) {
                    const user = JSON.parse(stored);
                    setIsAdmin(user.role === "ADMIN");
                    setCurrentUserId(user.userId);
                }
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, [isOpen]);

    if (!isOpen || !booking) return null;

    const start = new Date(booking.startDatetime);
    const end = new Date(booking.endDatetime);
    const startTime = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const endTime = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = start.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateBookingStatus(booking.booking_id, newStatus, currentUserId || 1);
            setActionDone(newStatus === "APPROVED" ? "Approved!" : "Rejected!");
            setTimeout(() => {
                setActionDone(null);
                onUpdated();
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update booking status.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteBooking(booking.booking_id);
            setActionDone("Deleted!");
            setTimeout(() => {
                setActionDone(null);
                setConfirmDelete(false);
                onUpdated();
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Failed to delete booking:", err);
            alert("Failed to delete booking.");
        } finally {
            setDeleting(false);
        }
    };

    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        APPROVED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
        PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
        REJECTED: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    };
    const sc = statusColors[booking.status] || statusColors.PENDING;

    // Only allow deletion if user is admin OR if it's the user's own booking (and it's PENDING)
    const canDelete = isAdmin || (booking.user?.user_id === currentUserId && booking.status === "PENDING");

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-black/5">
                {/* Success Overlay */}
                {actionDone && (
                    <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center rounded-2xl">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-100/50">
                            <CheckCircle2 size={32} strokeWidth={3} />
                        </div>
                        <p className="text-lg font-bold text-slate-800">{actionDone}</p>
                    </div>
                )}

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Booking Details</h2>
                    <button
                        onClick={() => { setConfirmDelete(false); onClose(); }}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                            {booking.status}
                        </span>
                        <span className="text-xs text-slate-400">ID: #{booking.booking_id}</span>
                    </div>

                    {/* Info Cards */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <CalendarClock size={16} className="text-indigo-500 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold text-slate-800">{dateStr}</div>
                                <div className="text-xs text-slate-500">{startTime} — {endTime}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <MapPin size={16} className="text-violet-500 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold text-slate-800">
                                    {booking.resource?.resource_name || "Unknown Resource"}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {booking.resource?.building?.building_name || "Unknown Building"}
                                    {booking.resource?.floor_number ? `, Floor ${booking.resource.floor_number}` : ""}
                                    {booking.resource?.resourceType?.type_name ? ` • ${booking.resource.resourceType.type_name}` : ""}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <UserCircle2 size={16} className="text-blue-500 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold text-slate-800">
                                    {booking.user?.name || "Unknown User"}
                                </div>
                                <div className="text-xs text-slate-500">Requested by</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 space-y-3">
                    {/* ADMIN ONLY: Status Update Buttons */}
                    {isAdmin && (
                        <>
                            {booking.status === "PENDING" && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate("APPROVED")}
                                        disabled={updating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        {updating ? "Updating..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate("REJECTED")}
                                        disabled={updating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
                                    >
                                        <XCircle size={16} />
                                        {updating ? "Updating..." : "Reject"}
                                    </button>
                                </div>
                            )}

                            {booking.status === "APPROVED" && (
                                <button
                                    onClick={() => handleStatusUpdate("REJECTED")}
                                    disabled={updating}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50"
                                >
                                    <XCircle size={16} />
                                    {updating ? "Updating..." : "Revoke Approval"}
                                </button>
                            )}

                            {booking.status === "REJECTED" && (
                                <button
                                    onClick={() => handleStatusUpdate("APPROVED")}
                                    disabled={updating}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle2 size={16} />
                                    {updating ? "Updating..." : "Re-Approve"}
                                </button>
                            )}
                        </>
                    )}

                    {/* Delete */}
                    {canDelete && (
                        !confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Trash2 size={16} />
                                Delete Booking
                            </button>
                        ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-3">
                                <div className="flex items-center gap-2 text-sm text-red-700 font-medium">
                                    <AlertTriangle size={16} />
                                    Are you sure? This action cannot be undone.
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {deleting ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="flex-1 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
