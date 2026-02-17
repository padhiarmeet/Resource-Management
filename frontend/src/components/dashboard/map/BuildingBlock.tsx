import React from "react";

interface BuildingBlockProps {
    onClick?: () => void;
    className?: string;
    isActive?: boolean;
    label?: string;
    style?: React.CSSProperties;
    mirrored?: boolean;
}

export const BuildingBlock: React.FC<BuildingBlockProps> = ({ onClick, className = "", isActive, label, style, mirrored }) => {
    return (
        <div
            className={`relative group cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
            onClick={onClick}
            style={style}
        >
            <svg
                viewBox="0 0 282 281"
                className={`w-full h-full transition-all duration-300 ${isActive ? 'filter brightness-110' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="282px"
                height="281px"
            >
                <g
                    transform={mirrored ? "scale(-1, 1) translate(-282, 0)" : ""}
                    className={`transition-colors duration-300 ${isActive ? 'fill-indigo-500 stroke-indigo-400' : 'fill-[#636CCB] stroke-slate-400'} hover:fill-[#858DDA] group-hover:stroke-indigo-400 stroke-[2]`}
                >
                    {/* Main vertical rectangle (left part) */}
                    <rect
                        x="0.5"
                        y="0.5"
                        width="160"
                        height="200"
                        stroke="none"
                    />

                    {/* Small connector rectangle (bottom middle) */}
                    <rect
                        x="40.5"
                        y="170.5"
                        width="40"
                        height="70"
                        stroke="none"
                    />

                    {/* Horizontal rectangle (right part) - rotated and flipped */}
                    <rect
                        x="100.5"
                        y="100.5"
                        width="160"
                        height="200"
                        transform="translate(180,0)scale(-1,1)translate(-180,0)rotate(-90,180,200)"
                        stroke="none"
                    />

                    {/* Triangle at the corner (rotated) */}
                    <path
                        d="M 150 70 L 192.07 112.5 L 150 155 Z"
                        transform="rotate(135,171.03,112.5)"
                        stroke="none"
                    />
                </g>

                {/* Label: centered and NOT flipped */}
                <text
                    x="141"
                    y="140"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-4xl font-bold select-none pointer-events-none"
                >
                    {label || "BLOCK"}
                </text>
            </svg>
        </div>
    );
};
