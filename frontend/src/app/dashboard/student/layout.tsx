import { ReactNode } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function StudentLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowedRoles={["STUDENT"]}>
            {children}
        </RoleGuard>
    );
}
