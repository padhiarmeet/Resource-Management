export const API_BASE_URL = "https://resource-management-backend.onrender.com/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
    // 1. Prepare options and headers
    const reqOptions: RequestInit = { ...options };
    
    // Ensure credentials are included to support HTTP-only refresh cookies
    reqOptions.credentials = "include";

    const headers = new Headers(reqOptions.headers || {});
    
    // 2. Attach existing access token if not logging in/registering/refreshing
    if (!endpoint.includes("/auth/")) {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }
    reqOptions.headers = headers;

    // 3. Make initial request
    let response = await fetch(`${API_BASE_URL}${endpoint}`, reqOptions);

    // 4. Handle 401 Unauthorized (Token Expiry) via Refresh Token
    // IMPORTANT: Avoid infinite loop if the refresh endpoint itself returns 401
    if ((response.status === 401 || response.status === 403) && !endpoint.includes("/auth/")) {
        try {
            // Attempt refresh
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Essential to send the HTTP-only cookie
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                // Store new token
                localStorage.setItem("accessToken", data.accessToken);
                
                // Re-attempt original request
                headers.set("Authorization", `Bearer ${data.accessToken}`);
                reqOptions.headers = headers;
                response = await fetch(`${API_BASE_URL}${endpoint}`, reqOptions);
            } else {
                // Refresh failed (user truly logged out or token revoked, or token expired)
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/login"; // Force redirect to login
                throw new Error("Session expired. Please log in again.");
            }
        } catch (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            throw err;
        }
    }

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.text();
            if (errorBody) {
                try {
                    // Try to parse as JSON first (handles Spring Boot Error responses)
                    const parsed = JSON.parse(errorBody);
                    errorMessage = parsed.message || errorBody;
                } catch {
                    // Not JSON, just use text
                    errorMessage = errorBody;
                }
            }
        } catch { /* ignore */ }
        throw new Error(errorMessage);
    }
    
    // Some endpoints return 204 No Content
    if (response.status === 204) return null;
    
    return response.json();
}

// ─── Dashboard APIs ───

export async function fetchBookings() {
    return apiFetch("/bookings/");
}

export async function fetchResources() {
    return apiFetch("/resources/");
}

export async function fetchCupboards() {
    try {
        return await apiFetch("/cupboards/");
    } catch {
        console.warn("Failed to fetch cupboards, returning empty list");
        return [];
    }
}

export async function fetchMaintenance() {
    return apiFetch("/maintenance/");
}

// ─── Booking Page APIs ───

export async function fetchBuildings() {
    return apiFetch("/buildings/");
}

export async function fetchResourceTypes() {
    return apiFetch("/resource-types/");
}

export interface BookingRequestPayload {
    user_id: number;
    resource_id: number;
    shelf_id?: number;
    start_datetime: string; // ISO format: "2026-02-10T07:45:00"
    end_datetime: string;
}

export async function submitBooking(payload: BookingRequestPayload) {
    return apiFetch("/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

// ─── Booking CRUD ───

export async function updateBookingStatus(bookingId: number, status: string, approverId: number) {
    return apiFetch(`/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, approverId }),
    });
}

export async function deleteBooking(bookingId: number) {
    return apiFetch(`/bookings/${bookingId}`, {
        method: "DELETE",
    });
}

// ─── Resource Bank APIs ───

export async function fetchFacilities() {
    return apiFetch("/facilities/");
}

export async function fetchFacilitiesByResource(resourceId: number) {
    return apiFetch(`/facilities/resource/${resourceId}`);
}

export async function fetchCupboardsByResource(resourceId: number) {
    return apiFetch(`/cupboards/resource/${resourceId}`);
}

export async function fetchShelves() {
    return apiFetch("/shelves/");
}

export async function fetchShelvesByCupboard(cupboardId: number) {
    return apiFetch(`/shelves/cupboard/${cupboardId}`);
}

// ─── Maintenance APIs ───

export interface MaintenancePayload {
    resource_id: number;
    maintenance_type: string;
    scheduled_date: string; // "YYYY-MM-DD"
    notes: string;
    status?: string;
}

export async function createMaintenance(payload: MaintenancePayload) {
    return apiFetch("/maintenance/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function deleteMaintenance(id: number) {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || response.statusText);
    }
    return response.text();
}

export async function fetchMaintenanceByBuilding(buildingId: number) {
    return apiFetch(`/maintenance/building/${buildingId}`);
}

// ─── Auth APIs ───

export async function authLogout() {
    return apiFetch("/auth/logout", {
        method: "POST",
    });
}

export async function loginUser(email: string, password: string) {
    return apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
}

export async function registerUser(name: string, email: string, password: string, role: string) {
    return apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
}

// ─── User-Specific Booking APIs ───

export async function fetchBookingsByUser(userId: number) {
    return apiFetch(`/bookings/user/${userId}`);
}

// ─── Maintenance Status & Notes APIs ───

export async function updateMaintenanceStatus(id: number, status: string) {
    return apiFetch(`/maintenance/${id}/status?status=${encodeURIComponent(status)}`, {
        method: "PUT",
    });
}

export async function updateMaintenanceNotes(id: number, notes: string) {
    return apiFetch(`/maintenance/${id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
    });
}
// ─── User Management APIs ───

export interface User {
    user_id: number;
    name: string;
    email: string;
    role: string;
    password?: string; // Optional for updates
}

export async function fetchUsers() {
    return apiFetch("/users");
}

export async function createUser(user: Partial<User>) {
    return apiFetch("/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

export async function updateUser(id: number, user: Partial<User>) {
    return apiFetch(`/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}

export async function deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.text();
}
