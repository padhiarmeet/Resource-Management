"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ResourceCard, Resource } from "@/components/dashboard/ResourceCard";
import { ResourceFilters } from "@/components/dashboard/ResourceFilters";
import { ResourceDetailModal } from "@/components/dashboard/ResourceDetailModal";
import { fetchResources } from "@/lib/api";
import { Archive, Plus } from "lucide-react";

export default function ResourceBankPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters State
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        building: ""
    });

    // Derived Lists for Dropdowns
    const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
    const [uniqueBuildings, setUniqueBuildings] = useState<string[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchResources();
            setResources(data || []);

            // Extract unique types and buildings
            const types = new Set<string>();
            const buildings = new Set<string>();

            (data || []).forEach((r: Resource) => {
                if (r.resourceType?.type_name) types.add(r.resourceType.type_name);
                if (r.building?.building_name) buildings.add(r.building.building_name);
            });

            setUniqueTypes(Array.from(types));
            setUniqueBuildings(Array.from(buildings));

        } catch (error) {
            console.error("Failed to load resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResourceClick = (resource: Resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.resource_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            r.description?.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.type ? r.resourceType?.type_name === filters.type : true;
        const matchesBuilding = filters.building ? r.building?.building_name === filters.building : true;

        return matchesSearch && matchesType && matchesBuilding;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0">
                <div className="max-w-[1600px] mx-auto p-8">

                    <DashboardHeader />

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resource Bank</h1>
                            <p className="text-slate-500 mt-2">Browse and manage all campus resources, facilities, and storage units.</p>
                        </div>

                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all">
                            <Plus size={20} />
                            Add Resource
                        </button>
                    </div>

                    <ResourceFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        types={uniqueTypes}
                        buildings={uniqueBuildings}
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <div key={n} className="h-48 bg-white border border-slate-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredResources.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                                    {filteredResources.map(resource => (
                                        <ResourceCard
                                            key={resource.resource_id}
                                            resource={resource}
                                            onClick={() => handleResourceClick(resource)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-slate-200 border-dashed rounded-lg">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Archive className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-700">No resources found</h3>
                                    <p className="text-slate-400 mt-1 max-w-sm">
                                        Try adjusting your search or filters to find what you're looking for.
                                    </p>
                                    <button
                                        onClick={() => setFilters({ search: "", type: "", building: "" })}
                                        className="mt-6 text-indigo-600 font-medium hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <ResourceDetailModal
                        resource={selectedResource}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />

                </div>
            </main>
        </div>
    );
}
