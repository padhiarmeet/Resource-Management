import React from "react";

interface TriangleProps {
    // Define triangle using three points
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    point3X: number;
    point3Y: number;
    x: number; // Position offset
    y: number; // Position offset
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
}

/**
 * Triangle component
 * Easy to customize - define three points and position
 */
export const Triangle: React.FC<TriangleProps> = ({
    point1X,
    point1Y,
    point2X,
    point2Y,
    point3X,
    point3Y,
    x,
    y,
    fill = "#F4F3F3",
    stroke = "none",
    strokeWidth = 0,
    className = ""
}) => {
    const points = `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y}`;

    // Calculate bounding box for the container
    const minX = Math.min(point1X, point2X, point3X);
    const minY = Math.min(point1Y, point2Y, point3Y);
    const maxX = Math.max(point1X, point2X, point3X);
    const maxY = Math.max(point1Y, point2Y, point3Y);
    const width = maxX - minX;
    const height = maxY - minY;

    return (
        <div
            className={`absolute ${className}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox={`${minX} ${minY} ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon
                    points={points}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className="hover:fill-grey"
                />
            </svg>
        </div>
    );
};

interface PolygonProps {
    // Define polygon using array of points
    points: { x: number; y: number }[];
    x: number; // Position offset
    y: number; // Position offset
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
}

/**
 * Custom polygon component
 * Easy to customize - define any number of points and position
 */
export const CustomPolygon: React.FC<PolygonProps> = ({
    points,
    x,
    y,
    fill = "#F4F3F3",
    stroke = "none",
    strokeWidth = 0,
    className = ""
}) => {
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

    // Calculate bounding box for the container
    const xCoords = points.map(p => p.x);
    const yCoords = points.map(p => p.y);
    const minX = Math.min(...xCoords);
    const minY = Math.min(...yCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);
    const width = maxX - minX;
    const height = maxY - minY;

    return (
        <div
            className={`absolute ${className}`}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <svg
                width={width}
                height={height}
                viewBox={`${minX} ${minY} ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon
                    points={pointsString}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className="color-white"
                />
            </svg>
        </div>
    );
};
