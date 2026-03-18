# 🏛️ Resource Management System

A full-stack web application for managing institutional resources — enabling users to book rooms, equipment, and storage, while admins manage facilities, maintenance, and users across buildings.

**🔗 Live Demo:** [resource-management-g3gd.vercel.app](https://resource-management-g3gd.vercel.app)

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | React framework with SSR |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Vercel** | Deployment & hosting |

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3** (Java 21) | REST API framework |
| **Spring Security 6** | Authentication & authorization |
| **Spring Data JPA** | ORM & database layer |
| **JWT + Refresh Tokens** | Stateless auth with HTTP-only cookies |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build tool |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **Neon (PostgreSQL)** | Serverless cloud database |
| **Docker** | Containerized backend deployment |
| **Render** | Backend cloud hosting |

---

## ✨ Features

### 👤 Authentication & Roles
- JWT-based login with **access token** (localStorage) + **refresh token** (HTTP-only cookie)
- Auto token refresh on 401 — seamless session management
- Role-based access: **Admin**, **Faculty**, **Student**, **Maintenance**
- Registration with role selection

### 📅 Booking System
- Book **resources** (rooms, labs, equipment) or **shelves** (inside cupboards)
- Select start/end datetime with conflict checking
- Booking status flow: `PENDING → APPROVED / REJECTED`
- Admin approves/rejects bookings; users view their own booking history

### 🏢 Resource & Facility Management
- Hierarchical structure: **Buildings → Resources → Cupboards → Shelves → Facilities**
- Filter resources by type, building, and availability
- Interactive **campus map** for visual resource selection
- Resource types categorization

### 🔧 Maintenance
- Log maintenance tasks with type, date, notes, and status
- Maintenance status updates (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`)
- Filter by building; dedicated maintenance staff dashboard

### 👨‍💼 Admin Panel
- Full **User Management** (CRUD)
- Enable/disable user accounts
- Role assignment and management
- System-wide booking overview and approval queue

### 📊 Dashboard
- Role-aware dashboard (different views for Admin, Faculty, Student, Maintenance)
- Stats cards: total resources, active bookings, pending approvals
- Maintenance widget, booking timeline view
- Profile page with account management

---

## 🗂️ Project Structure

```
resource_management/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   ├── Config/             # CORS, Security config
│   │   ├── Controller/         # REST controllers
│   │   ├── Dtos/               # Request/Response DTOs
│   │   ├── Model/              # JPA entities
│   │   ├── Repository/         # Spring Data repositories
│   │   ├── Security/           # JWT filter, services
│   │   └── Services/           # Business logic
│   └── Dockerfile              # Multi-stage Docker build
│
└── frontend/                   # Next.js App
    └── src/
        ├── app/                # App Router pages
        │   ├── dashboard/      # Role-specific dashboards
        │   ├── login/
        │   └── signup/
        ├── components/         # Reusable UI components
        └── lib/
            └── api.ts          # Centralized API client
```

---

## 🔐 API Endpoints Overview

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/refresh` | Public |
| `GET/POST` | `/api/bookings/` | Authenticated |
| `PUT` | `/api/bookings/{id}/status` | Admin |
| `GET/POST` | `/api/resources/` | Authenticated |
| `GET/POST` | `/api/maintenance/` | Authenticated |
| `GET/POST/DELETE` | `/api/users/` | Admin |
| `GET` | `/api/buildings/` | Authenticated |

---

## 🛠️ Local Setup

### Prerequisites
- Java 21, Maven, Node.js 18+, Docker (optional), PostgreSQL

### Backend
```bash
cd backend
# Update src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`, backend on `http://localhost:8080`.

---

## 🐳 Docker (Backend)

```bash
cd backend
docker build -t resource-management-backend .
docker run -p 8080:8080 resource-management-backend
```

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Admin** | Full access — manage users, approve bookings, all resources |
| **Faculty** | Book resources, view own bookings |
| **Student** | Book resources/shelves, view own bookings |
| **Maintenance** | View & update maintenance tasks |
