import React from "react";

interface GroundBlockProps {
    width: number;
    height: number;
    x: number;
    y: number;
    label: string;
    className?: string;
}

/**
 * Simple rectangular ground block component
 * Easy to customize - just change width, height, x, and y properties
 */
export const GroundBlock: React.FC<GroundBlockProps> = ({ width, height, x, y, label, className = "" }) => {
    return (
        <div
            className={`absolute ${className}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            <div className="w-full h-full bg-[#F4F3F3] border-0 border-slate-400 flex items-center justify-center">
                <span className="text-slate-600 font-bold text-lg select-none">
                    {label}
                </span>
            </div>
        </div>
    );
};

interface LShapedBlockProps {
    // Vertical part dimensions
    verticalWidth: number;
    verticalHeight: number;
    // Horizontal part dimensions  
    horizontalWidth: number;
    horizontalHeight: number;
    x: number;
    y: number;
    label: string;
    rotation?: number; // Rotation in degrees (0, 90, 180, 270)
    className?: string;
}

/**
 * L-shaped ground block component
 * The L is formed by a vertical rectangle on the left and a horizontal rectangle extending to the right from the bottom
 * Easy to customize - adjust all dimensions and position as needed
 */
export const LShapedBlock: React.FC<LShapedBlockProps> = ({
    verticalWidth,
    verticalHeight,
    horizontalWidth,
    horizontalHeight,
    x,
    y,
    label,
    rotation = 0,
    className = ""
}) => {
    return (
        <div
            className={`absolute ${className}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${Math.max(verticalWidth, horizontalWidth)}px`,
                height: `${verticalHeight}px`,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
            }}
        >
            {/* Vertical part of the L */}
            <div
                className="absolute bg-[#F4F3F3] border-0 border-slate-400"
                style={{
                    width: `${verticalWidth}px`,
                    height: `${verticalHeight}px`,
                    left: 0,
                    top: 0,
                }}
            />

            {/* Horizontal part of the L (at the bottom) */}
            <div
                className="absolute bg-[#F4F3F3] border-0 border-slate-400"
                style={{
                    width: `${horizontalWidth}px`,
                    height: `${horizontalHeight}px`,
                    left: 0,
                    top: `${verticalHeight - horizontalHeight}px`,
                }}
            />

            {/* Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-lg select-none">
                    {label}
                </span>
            </div>
        </div>
    );
};
