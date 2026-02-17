import React from "react";

interface ABlockProps {
    onClick?: () => void;
    className?: string;
    isActive?: boolean;
    label?: string;
    rotation?: number;
}

export const ABlock: React.FC<ABlockProps> = ({ onClick, className = "", isActive, label, rotation = 0 }) => {
    return (
        <div
            className={`relative group cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
            onClick={onClick}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <svg
                viewBox="0 0 761 242"
                className={`w-full h-full transition-all duration-300 ${isActive ? 'filter brightness-110' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                width="761px"
                height="242px"
            >
                <g className={`transition-colors duration-300 ${isActive ? 'fill-indigo-500 stroke-indigo-400' : 'fill-[#636CCB] stroke-slate-400'} hover:fill-[#858DDA] group-hover:stroke-indigo-400 stroke-[2]`}>
                    {/* Left rectangle */}
                    <rect x="40.5" y="40.5" width="240" height="200" stroke="none" />
                    {/* Middle rectangle */}
                    <rect x="280.5" y="0.5" width="200" height="200" stroke="none" />
                    {/* Right rectangle */}
                    <rect x="480.5" y="40.5" width="240" height="200" stroke="none" />
                    {/* Left connector */}
                    <rect x="0.5" y="120.5" width="40" height="80" stroke="none" />
                    {/* Right connector */}
                    <rect x="720.5" y="120.5" width="40" height="80" stroke="none" />
                </g>

                {/* Label */}
                <text
                    x="380"
                    y="120"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-4xl font-bold select-none pointer-events-none"
                >
                    {label || "A"}
                </text>
            </svg>
        </div>
    );
};
