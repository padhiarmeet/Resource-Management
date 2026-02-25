// ... (previous imports)
import { ShelfBookingModal } from "./ShelfBookingModal";
import React, { useEffect, useState } from "react";

import {
    X,
    Monitor,
    Box,
    Archive,
    Wrench,
    CalendarCheck,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Resource } from "./ResourceCard";
import {
    fetchFacilitiesByResource,
    fetchCupboardsByResource,
    fetchShelvesByCupboard,
    fetchMaintenance
} from "@/lib/api";

interface ResourceDetailModalProps {
    resource: Resource | null;
    isOpen: boolean;
    onClose: () => void;
}

interface Facility {
    facility_id: number;
    facility_name: string;
    details: string;
}

interface Shelf {
    shelf_id: number;
    shelf_number: number;
    capacity: number;
    description: string;
}

interface Cupboard {
    cupboard_id: number;
    cupboard_name: string;
    total_shelves: number;
    shelves?: Shelf[]; // augmented with fetched shelves
}

interface MaintenanceLog {
    maintenance_id: number;
    maintenance_type: string;
    scheduled_date: string;
    status: string;
    notes: string;
    resource: { resource_id: number };
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, isOpen, onClose }) => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [cupboards, setCupboards] = useState<Cupboard[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [activetab, setActiveTab] = useState<"overview" | "storage" | "maintenance">("overview");

    // Booking Modal State
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const [selectedCupboard, setSelectedCupboard] = useState<Cupboard | null>(null); // Optional if needed context
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        if (resource && isOpen) {
            loadDetails(resource.resource_id);
        }
    }, [resource, isOpen]);

    const loadDetails = async (resourceId: number) => {
        setLoading(true);
        try {
            // Parallel fetch of direct relations
            const [facilitiesData, cupboardsData, allMaintenance] = await Promise.all([
                fetchFacilitiesByResource(resourceId),
                fetchCupboardsByResource(resourceId),
                fetchMaintenance()
            ]);

            setFacilities(facilitiesData || []);

            // Filter maintenance for this resource
            // Note: API returns all maintenance, filtering client-side
            const resourceMaintenance = (allMaintenance || []).filter((m: any) =>
                m.resource?.resource_id === resourceId
            );
            setMaintenance(resourceMaintenance);

            // Fetch shelves for each cupboard
            const cupboardsWithShelves = await Promise.all(
                (cupboardsData || []).map(async (cupboard: Cupboard) => {
                    try {
                        const shelves = await fetchShelvesByCupboard(cupboard.cupboard_id);
                        return { ...cupboard, shelves: shelves || [] };
                    } catch (e) {
                        console.error(`Failed to fetch shelves for cupboard ${cupboard.cupboard_id}`, e);
                        return { ...cupboard, shelves: [] };
                    }
                })
            );
            setCupboards(cupboardsWithShelves);

        } catch (error) {
            console.error("Failed to load resource details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookShelf = (shelf: Shelf, cupboard: Cupboard) => {
        setSelectedShelf(shelf);
        setSelectedCupboard(cupboard);
        setIsBookingModalOpen(true);
    };

    if (!isOpen || !resource) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 is-map-page">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                                    {resource.resourceType?.type_name}
                                </span>
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-500 text-sm font-medium">
                                    {resource.building?.building_name}, Floor {resource.floor_number}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{resource.resource_name}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 px-6">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activetab === "overview" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            Overview & Facilities
                        </button>
                        <button
                            onClick={() => setActiveTab("storage")}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activetab === "storage" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            Storage ({cupboards.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("maintenance")}
                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activetab === "maintenance" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            Maintenance ({maintenance.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* OVERVIEW TAB */}
                                {activetab === "overview" && (
                                    <div className="space-y-6">
                                        <div className="prose prose-sm text-slate-600">
                                            <p>{resource.description || "No description provided for this resource."}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <Monitor size={16} /> Facilities ({facilities.length})
                                            </h3>
                                            {facilities.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {facilities.map(f => (
                                                        <div key={f.facility_id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                            <div className="font-semibold text-slate-700">{f.facility_name}</div>
                                                            <div className="text-xs text-slate-500 mt-1">{f.details}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-400 italic">No specific facilities listed.</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* STORAGE TAB */}
                                {activetab === "storage" && (
                                    <div className="space-y-4">
                                        {cupboards.length > 0 ? (
                                            cupboards.map(cupboard => (
                                                <div key={cupboard.cupboard_id} className="border border-slate-200 rounded-lg overflow-hidden">
                                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                                        <div className="font-semibold text-slate-700 flex items-center gap-2">
                                                            <Box size={16} /> {cupboard.cupboard_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                            {cupboard.total_shelves} Shelves
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white">
                                                        {cupboard.shelves && cupboard.shelves.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {cupboard.shelves.map(shelf => (
                                                                    <div key={shelf.shelf_id} className="flex items-center gap-3 text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                                                                        <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                                            {shelf.shelf_number}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="text-slate-700">{shelf.description || "Shelf Storage"}</div>
                                                                            <div className="text-xs text-slate-400">Capacity: {shelf.capacity} units</div>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleBookShelf(shelf, cupboard)}
                                                                            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-700 shadow-sm"
                                                                        >
                                                                            Book
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-slate-400 italic text-center py-2">No shelves recorded.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <Archive size={48} className="mb-3 opacity-20" />
                                                <p>No storage units assigned to this resource.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* MAINTENANCE TAB */}
                                {activetab === "maintenance" && (
                                    <div className="space-y-3">
                                        {maintenance.length > 0 ? (
                                            maintenance.map(m => (
                                                <div key={m.maintenance_id} className="flex gap-3 p-4 bg-white border border-slate-200 rounded-lg">
                                                    <div className="mt-0.5">
                                                        {m.status === "COMPLETED" ? (
                                                            <CheckCircle2 className="text-emerald-500" size={20} />
                                                        ) : (
                                                            <AlertCircle className="text-amber-500" size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{m.maintenance_type}</div>
                                                        <div className="text-sm text-slate-600 mt-1">{m.notes}</div>
                                                        <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarCheck size={12} /> {m.scheduled_date}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded bg-slate-100 ${m.status !== "COMPLETED" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}>
                                                                {m.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                <Wrench size={48} className="mb-3 opacity-20" />
                                                <p>No maintenance history available.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-semibold text-sm hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <a href="/dashboard/faculty/booking" className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-m shadow-indigo-200">
                            Book Resource
                        </a>
                    </div>
                </div>
            </div>

            <ShelfBookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                shelf={selectedShelf}
                resource={resource}
                onSuccess={() => {
                    // Refresh details or just close?
                    // Maybe just toast notification?
                }}
            />
        </>
    );
};
