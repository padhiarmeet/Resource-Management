export const API_BASE_URL = "http://localhost:8080/api";

async function apiFetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        // Try to read the actual error message from the backend response body
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.text();
            if (errorBody) errorMessage = errorBody;
        } catch { /* ignore parse errors */ }
        throw new Error(errorMessage);
    }
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
    return apiFetch("/users/");
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
