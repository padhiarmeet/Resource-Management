"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BuildingBlock } from "@/components/dashboard/map/BuildingBlock";
import { ABlock } from "@/components/dashboard/map/ABlock";
import { DBlock } from "@/components/dashboard/map/DBlock";
import { GroundBlock, LShapedBlock } from "@/components/dashboard/map/GroundBlock";
import { Triangle, CustomPolygon } from "@/components/dashboard/map/CustomShapes";
import { fetchResources } from "@/lib/api";
import { Resource } from "@/components/dashboard/ResourceCard";
import { ResourceDetailModal } from "@/components/dashboard/ResourceDetailModal";
import { X, Map as MapIcon, Box } from "lucide-react";

// ========== EASY CONFIGURATION FOR GROUND BLOCKS ==========
// Adjust these values to change size and position of ground blocks

// Ground 1: Rectangle below A-Block
const GROUND1_CONFIG = {
    width: 180,
    height: 260,
    x: 770,
    y: 300,
};

// Ground 2: Rectangle below C-Block (left)
const GROUND2_CONFIG = {
    width: 70,
    height: 180,
    x: 1030,
    y: 300,
};

// Ground 3: Rectangle above D-Block
const GROUND3_CONFIG = {
    width: 240,
    height: 100,
    x: 460,
    y: 480,
};

// Ground 4: L-shaped block below C-Block (bottom right)
const GROUND4_CONFIG = {
    verticalWidth: 80,// = - height
    verticalHeight: 240,
    horizontalWidth: 180, // || - height
    horizontalHeight: 70, // || - width
    x: 490,
    y: 270,
};

// ========== CUSTOM SHAPES CONFIGURATION ==========

// Triangle 1: Left triangle
const TRIANGLE1_CONFIG = {
    point1X: 0,
    point1Y: 0,
    point2X: 40,
    point2Y: 170,
    point3X: 0,
    point3Y: 170,
    x: 100,
    y: 340,
};

// Polygon: Center large polygon (trapezoid/pentagon shape)
const POLYGON_CONFIG = {
    points: [
        { x: 0, y: 0 },     // Top left
        { x: 160, y: 0 },   // Top right
        { x: 120, y: 220 }, // Bottom right
        { x: 40, y: 220 },  // Bottom left
    ],
    x: 130,
    y: 290,
};


// Triangle 2: Right triangle
const TRIANGLE2_CONFIG = {
    point1X: 40,
    point1Y: 0,
    point2X: 40,
    point2Y: 170,
    point3X: 0,
    point3Y: 170,
    x: 280,
    y: 340,
};

// ========== END CONFIGURATION ==========


export default function MapPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

    // Building names mapped to the 6 structures
    const BUILDINGS = {
        ABLOCK_TOP: "A-Block (Top)",
        CBLOCK_LEFT: "C-Block (West)",
        CBLOCK_RIGHT: "C-Block (East)",
        DBLOCK_BOTTOM: "D-Block (South)",
        DBLOCK_LEFT: "D-Block (West)",
        CBLOCK_BOTTOM_RIGHT: "C-Block (South-East)"
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchResources();
            setResources(data || []);
        } catch (error) {
            console.error("Failed to load map data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBuildingResources = (buildingName: string) => {
        // Distribute resources among buildings based on building assignments
        const allResources = resources;
        const buildingIndex = Object.values(BUILDINGS).indexOf(buildingName);
        const resourcesPerBuilding = Math.ceil(allResources.length / 6);

        return allResources.slice(
            buildingIndex * resourcesPerBuilding,
            (buildingIndex + 1) * resourcesPerBuilding
        );
    };

    const handleBlockClick = (blockName: string) => {
        setSelectedBuilding(blockName);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-x-hidden">
            <Sidebar className="hidden md:block" />

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 relative h-screen flex flex-col overflow-hidden">
                <div className="bg-white text-slate-900 px-8 py-4 z-10 border-b border-slate-200">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <MapIcon className="text-indigo-600" size={24} />
                        </div>
                        Campus Map
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 ml-[52px]">Interactive campus building and resource navigator</p>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-white">

                    {/* Grid Background Effect */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}>
                    </div>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-50/30 via-transparent to-slate-100/50"></div>

                    {/* The Map Layout - 6 Buildings */}
                    <div className="relative w-[1400px] h-[800px] scale-75 origin-center">

                        {/* Top Center - A-Block */}
                        <div className="absolute top-4 left-4/6 transform -translate-x-1/2">
                            <ABlock
                                label="A"
                                onClick={() => handleBlockClick(BUILDINGS.ABLOCK_TOP)}
                                isActive={selectedBuilding === BUILDINGS.ABLOCK_TOP}
                                className="w-[490px] h-auto"
                            />
                        </div>

                        {/* Left of A-Block - C1 (rotated 90deg clockwise) */}
                        <div className="absolute top-14 left-86 transform rotate-90">
                            <BuildingBlock
                                label="C"
                                onClick={() => handleBlockClick(BUILDINGS.CBLOCK_LEFT)}
                                isActive={selectedBuilding === BUILDINGS.CBLOCK_LEFT}
                                className="w-48 h-48"
                                mirrored={false}
                            />
                        </div>

                        {/* Right of A-Block - C2 (rotated 90deg counter-clockwise) */}
                        <div className="absolute top-14 left-293 transform -rotate-90">
                            <BuildingBlock
                                label="B"
                                onClick={() => handleBlockClick(BUILDINGS.CBLOCK_RIGHT)}
                                isActive={selectedBuilding === BUILDINGS.CBLOCK_RIGHT}
                                className="w-48 h-48"
                                mirrored={true}
                            />
                        </div>

                        {/* Bottom Center - D-Block */}
                        <div className="absolute bottom-0 left-2/12 transform -translate-x-1/2">
                            <DBlock
                                label="D"
                                onClick={() => handleBlockClick(BUILDINGS.DBLOCK_BOTTOM)}
                                isActive={selectedBuilding === BUILDINGS.DBLOCK_BOTTOM}
                                className="w-[380px] h-auto"
                                rotation={180}
                            />
                        </div>

                        {/* Left Bottom - D-Block (rotated 90deg) */}
                        <div className="absolute top-50 right-280">
                            <DBlock
                                label="G"
                                onClick={() => handleBlockClick(BUILDINGS.DBLOCK_LEFT)}
                                isActive={selectedBuilding === BUILDINGS.DBLOCK_LEFT}
                                className="w-[380px] h-auto"
                                rotation={90}
                            />
                        </div>

                        {/* Below C2 - C3 (rotated 90deg anti-clockwise) */}
                        <div className="absolute top-96 left-293 transform -rotate-90">
                            <BuildingBlock
                                label="E"
                                onClick={() => handleBlockClick(BUILDINGS.CBLOCK_BOTTOM_RIGHT)}
                                isActive={selectedBuilding === BUILDINGS.CBLOCK_BOTTOM_RIGHT}
                                className="w-48 h-48"
                                mirrored={false}
                            />
                        </div>

                        {/* ========== GROUND BLOCKS ========== */}

                        {/* Ground 1: Rectangle below A-Block */}
                        <GroundBlock
                            width={GROUND1_CONFIG.width}
                            height={GROUND1_CONFIG.height}
                            x={GROUND1_CONFIG.x}
                            y={GROUND1_CONFIG.y}
                            label="Ground 1"
                        />

                        {/* Ground 2: Rectangle below C-Block (left) */}
                        <GroundBlock
                            width={GROUND2_CONFIG.width}
                            height={GROUND2_CONFIG.height}
                            x={GROUND2_CONFIG.x}
                            y={GROUND2_CONFIG.y}
                            label="Ground 2"
                        />

                        {/* Ground 3: Rectangle above D-Block */}
                        <GroundBlock
                            width={GROUND3_CONFIG.width}
                            height={GROUND3_CONFIG.height}
                            x={GROUND3_CONFIG.x}
                            y={GROUND3_CONFIG.y}
                            label="Ground 3"
                        />

                        {/* Ground 4: L-shaped block below C-Block (bottom right) - rotated 90° */}
                        <LShapedBlock
                            verticalWidth={GROUND4_CONFIG.verticalWidth}
                            verticalHeight={GROUND4_CONFIG.verticalHeight}
                            horizontalWidth={GROUND4_CONFIG.horizontalWidth}
                            horizontalHeight={GROUND4_CONFIG.horizontalHeight}
                            x={GROUND4_CONFIG.x}
                            y={GROUND4_CONFIG.y}
                            label=" "
                            rotation={270}
                        />

                        {/* ========== CUSTOM SHAPES ========== */}

                        {/* Triangle 1: Left */}
                        <Triangle
                            point1X={TRIANGLE1_CONFIG.point1X}
                            point1Y={TRIANGLE1_CONFIG.point1Y}
                            point2X={TRIANGLE1_CONFIG.point2X}
                            point2Y={TRIANGLE1_CONFIG.point2Y}
                            point3X={TRIANGLE1_CONFIG.point3X}
                            point3Y={TRIANGLE1_CONFIG.point3Y}
                            x={TRIANGLE1_CONFIG.x}
                            y={TRIANGLE1_CONFIG.y}
                        />

                        {/* Polygon: Center */}
                        <CustomPolygon
                            points={POLYGON_CONFIG.points}
                            x={POLYGON_CONFIG.x}
                            y={POLYGON_CONFIG.y}
                        />

                        {/* Triangle 2: Right */}
                        <Triangle
                            point1X={TRIANGLE2_CONFIG.point1X}
                            point1Y={TRIANGLE2_CONFIG.point1Y}
                            point2X={TRIANGLE2_CONFIG.point2X}
                            point2Y={TRIANGLE2_CONFIG.point2Y}
                            point3X={TRIANGLE2_CONFIG.point3X}
                            point3Y={TRIANGLE2_CONFIG.point3Y}
                            x={TRIANGLE2_CONFIG.x}
                            y={TRIANGLE2_CONFIG.y}
                        />

                    </div>


                    {/* Resources Panel (Drawer) */}
                    <div
                        className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 ease-in-out z-20 ${selectedBuilding ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        {selectedBuilding && (
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <div className="p-1.5 bg-indigo-100 rounded-lg">
                                            <Box className="text-indigo-600" size={20} />
                                        </div>
                                        {selectedBuilding}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedBuilding(null)}
                                        className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        Available Resources ({getBuildingResources(selectedBuilding).length})
                                    </h3>

                                    {getBuildingResources(selectedBuilding).length > 0 ? (
                                        getBuildingResources(selectedBuilding).map(resource => (
                                            <div
                                                key={resource.resource_id}
                                                onClick={() => {
                                                    setSelectedResource(resource);
                                                    setIsResourceModalOpen(true);
                                                }}
                                                className="bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {resource.resource_name}
                                                    </h4>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                                                        {resource.resourceType?.type_name || 'Item'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                                    {resource.description || "No description available."}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between text-xs">
                                                    <span className="text-slate-400">Floor {resource.floor_number}</span>
                                                    <span className="text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <Box className="mx-auto mb-3 text-slate-300" size={40} />
                                            <p className="font-medium">No resources found in this building.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                <ResourceDetailModal
                    resource={selectedResource}
                    isOpen={isResourceModalOpen}
                    onClose={() => setIsResourceModalOpen(false)}
                />
            </main>
        </div>
    );
}
