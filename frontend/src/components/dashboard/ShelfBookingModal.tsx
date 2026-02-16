"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { submitBooking } from "@/lib/api";

interface Shelf {
    shelf_id: number;
    shelf_number: number;
    capacity: number;
    description: string;
}

interface Resource {
    resource_id: number;
    resource_name: string;
}

interface ShelfBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    shelf: Shelf | null;
    resource: Resource | null;
    onSuccess: () => void;
}

export const ShelfBookingModal: React.FC<ShelfBookingModalProps> = ({
    isOpen,
    onClose,
    shelf,
    resource,
    onSuccess,
}) => {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form
            setStartDate("");
            setStartTime("");
            setEndDate("");
            setEndTime("");
            setError(null);
            setSuccess(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                throw new Error("User not found. Please log in.");
            }
            const user = JSON.parse(userStr);

            if (!shelf || !resource) {
                throw new Error("Missing shelf or resource information.");
            }

            const startDateTime = `${startDate}T${startTime}:00`;
            const endDateTime = `${endDate}T${endTime}:00`;

            if (new Date(startDateTime) >= new Date(endDateTime)) {
                throw new Error("End time must be after start time.");
            }

            await submitBooking({
                user_id: user.userId,
                resource_id: resource.resource_id,
                shelf_id: shelf.shelf_id,
                start_datetime: startDateTime,
                end_datetime: endDateTime,
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Failed to book shelf.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !shelf) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">

                {/* Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Book Shelf #{shelf.shelf_number}</h3>
                        <p className="text-xs text-slate-500">{resource?.resource_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Booking Requested!</h4>
                            <p className="text-slate-500 text-sm">Your booking request has been submitted for approval.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Start Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="time"
                                            required
                                            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="date"
                                            required
                                            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">End Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="time"
                                            required
                                            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-slate-600 font-semibold text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        "Confirm Booking"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
