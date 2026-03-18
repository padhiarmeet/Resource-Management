"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            // Assuming role comes back as uppercase string like "STUDENT", "FACULTY", "MAINTENANCE", "ADMIN"
            const userRole = user.role ? user.role.toUpperCase() : "STUDENT";
            
            if (allowedRoles.includes(userRole)) {
                setIsAuthorized(true);
            } else {
                // Redirect user to their appropriate dashboard
                if (userRole === "STUDENT") router.push("/dashboard/student");
                else if (userRole === "FACULTY") router.push("/dashboard/faculty");
                else if (userRole === "MAINTENANCE") router.push("/dashboard/maintenance");
                else router.push("/dashboard");
            }
        } catch {
            router.push("/login");
        }
    }, [router, allowedRoles]);

    // Do not render anything until we confirm auth status
    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
