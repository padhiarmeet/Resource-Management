"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Pages that must ALWAYS render in light mode, regardless of user preference
const LIGHT_ONLY_PATHS = ["/", "/login", "/signup"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Whether the current page should be forced to light mode
    const isLightOnlyPage = LIGHT_ONLY_PATHS.includes(pathname);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as Theme | null;
        if (stored) {
            setThemeState(stored);
        } else {
            setThemeState("system");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.remove("light", "dark");

        // On light-only pages (landing, login, signup) always force light
        if (isLightOnlyPage) {
            root.classList.add("light");
            return;
        }

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        localStorage.setItem("theme", theme);
    }, [theme, mounted, isLightOnlyPage]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
