
export interface Building {
    building_id: number;
    building_name: string;
    building_number: string;
    total_floors: number;
}

export interface ResourceType {
    resource_type_id: number;
    type_name: string;
}

export interface BookingRequest {
    building_id: number;
    resource_type_id: number;
    start_datetime: string; // ISO string
    end_datetime: string;   // ISO string
}

export interface Booking {
    booking_id: number;
    building_name: string;
    resource_type: string;
    start_datetime: string;
    end_datetime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    faculty_name: string;
}

const MOCK_BUILDINGS: Building[] = [
    { building_id: 1, building_name: "Engineering Block A", building_number: "E-101", total_floors: 4 },
    { building_id: 2, building_name: "Science Complex", building_number: "S-201", total_floors: 3 },
    { building_id: 3, building_name: "Management Wing", building_number: "M-301", total_floors: 2 },
    { building_id: 4, building_name: "Main Auditorium", building_number: "A-001", total_floors: 1 },
];

const MOCK_RESOURCE_TYPES: ResourceType[] = [
    { resource_type_id: 1, type_name: "Classroom" },
    { resource_type_id: 2, type_name: "Lab" },
    { resource_type_id: 3, type_name: "Auditorium" },
    { resource_type_id: 4, type_name: "Conference Room" },
    { resource_type_id: 5, type_name: "Projector" },
];

// Generate dynamic mock bookings for the current week
const getMockBookings = (): Booking[] => {
    const today = new Date();
    const isoDate = today.toISOString().split('T')[0];

    return [
        {
            booking_id: 101,
            building_name: "Engineering Block A",
            resource_type: "Classroom",
            start_datetime: `${isoDate}T07:45:00`,
            end_datetime: `${isoDate}T09:35:00`,
            status: "APPROVED",
            faculty_name: "Dr. Robert Smith"
        },
        {
            booking_id: 102,
            building_name: "Science Complex",
            resource_type: "Lab",
            start_datetime: `${isoDate}T12:10:00`,
            end_datetime: `${isoDate}T13:50:00`,
            status: "PENDING",
            faculty_name: "Prof. Sarah Jones"
        }
    ];
};

// State to hold bookings during the session
let bookingsStore: Booking[] = getMockBookings();

export const fetchBuildings = async (): Promise<Building[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_BUILDINGS;
};

export const fetchResourceTypes = async (): Promise<ResourceType[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_RESOURCE_TYPES;
};

export const fetchBookings = async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...bookingsStore];
};

export const submitBooking = async (booking: BookingRequest): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find metadata for better display
    const building = MOCK_BUILDINGS.find(b => b.building_id === booking.building_id);
    const resource = MOCK_RESOURCE_TYPES.find(r => r.resource_type_id === booking.resource_type_id);

    const newBooking: Booking = {
        booking_id: Date.now(),
        building_name: building?.building_name || "Unknown Building",
        resource_type: resource?.type_name || "Unknown Type",
        start_datetime: booking.start_datetime,
        end_datetime: booking.end_datetime,
        status: "PENDING",
        faculty_name: "You (Current User)"
    };

    bookingsStore.push(newBooking);
    console.log("Booking added to store:", newBooking);

    return { success: true, message: "Booking request sent to Admin for approval." };
};
