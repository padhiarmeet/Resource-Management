import { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MaintenanceLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowedRoles={["MAINTENANCE"]}>
            {children}
        </RoleGuard>
    );
}
