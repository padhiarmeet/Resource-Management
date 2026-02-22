const users = [
    { name: "System Admin", email: "admin@example.com", role: "admin", password: "admin123" },
    { name: "John Faculty", email: "faculty@example.com", role: "faculty", password: "faculty123" },
    { name: "Alice Student", email: "student@example.com", role: "student", password: "student123" },
    { name: "Mike Maintenance", email: "maintenance@example.com", role: "maintenance", password: "maintenance123" }
];

async function seed() {
    for (let u of users) {
        try {
            const res = await fetch("http://localhost:8080/api/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic bWVldDpwYWRoaWFy"
                },
                body: JSON.stringify(u)
            });
            if (!res.ok) {
                const text = await res.text();
                console.error(`Failed to seed ${u.name}. Status: ${res.status} ${res.statusText}. Response: ${text}`);
            } else {
                console.log(`Seeded ${u.name} successfully.`);
            }
        } catch (e) {
            console.error(`Error requesting ${u.name}:`, e.message);
        }
    }
}

seed();
