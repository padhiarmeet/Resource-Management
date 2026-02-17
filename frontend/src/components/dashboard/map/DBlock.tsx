import React from "react";

interface DBlockProps {
    onClick?: () => void;
    className?: string;
    isActive?: boolean;
    label?: string;
    rotation?: number;
}

export const DBlock: React.FC<DBlockProps> = ({ onClick, className = "", isActive, label, rotation = 0 }) => {
    return (
        <div
            className={`relative group cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
            onClick={onClick}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <svg
                viewBox="0 0 602 322"
                className={`w-full h-full transition-all duration-300 ${isActive ? 'filter brightness-110' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="602px"
                height="322px"
            >
                <g className={`transition-colors duration-300 ${isActive ? 'fill-indigo-500 stroke-indigo-400' : 'fill-[#636CCB] stroke-slate-400'} hover:fill-[#858DDA] group-hover:stroke-indigo-400 stroke-[2]`}>
                    {/* Main horizontal rectangle */}
                    <rect x="0.5" y="80.5" width="600" height="200" stroke="none" />

                    {/* Three top rectangles */}
                    <rect x="40.5" y="260.5" width="120" height="60" stroke="none" />
                    <rect x="240.5" y="260.5" width="120" height="60" stroke="none" />
                    <rect x="440.5" y="260.5" width="120" height="60" stroke="none" />
                    {/* Two upper sections */}
                    <rect x="80.5" y="40.5" width="200" height="100" stroke="none" />
                    <rect x="320.5" y="40.5" width="197" height="100" stroke="none" />
                    {/* Top connectors */}
                    <rect x="80.5" y="0.5" width="80" height="40" stroke="none" />
                    <rect x="437.5" y="0.5" width="80" height="40" stroke="none" />
                </g>

                {/* Label */}
                <text
                    x="300"
                    y="180"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-4xl font-bold select-none pointer-events-none"
                >
                    {label || "D"}
                </text>
            </svg>
        </div>
    );
};
