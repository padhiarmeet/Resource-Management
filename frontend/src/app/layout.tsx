import type { Metadata } from "next";
import { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
    title: "OpenSlot",
    description: "Modern Resource Management System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={GeistSans.className}>{children}</body>
        </html>
    );
}
