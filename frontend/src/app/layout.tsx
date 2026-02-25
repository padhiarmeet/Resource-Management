import type { Metadata } from "next";
import { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "OpenSlot",
    description: "Modern Resource Management System",
};

// Pages that must always be light — check at the URL level before React mounts
const LIGHT_ONLY_PATHS = ["/", "/login", "/signup"];

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Blocking script: runs before first paint to prevent dark flash on light-only pages */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  var lightOnlyPaths = ${JSON.stringify(LIGHT_ONLY_PATHS)};
  var path = window.location.pathname;
  if (lightOnlyPaths.indexOf(path) !== -1) {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
})();
                        `.trim(),
                    }}
                />
            </head>
            <body className={GeistSans.className}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

