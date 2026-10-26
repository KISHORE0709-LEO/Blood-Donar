# 🩸 Blood Donor & Emergency Request Management System

A full-stack web application built with **React.js** (frontend) and **Spring Boot** (backend) that connects blood donors with patients in emergency need.

---

## 📌 Project Overview

| Field | Details |
|---|---|
| Project Title | Blood Donor & Emergency Request Management System |
| Frontend | React.js 18, React Router, Axios, React Toastify |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | MySQL 9.5 |
| Authentication | JWT (JSON Web Token) |
| Architecture | REST API + SPA (Single Page Application) |

---

## 🎯 Problem Statement

Blood shortages during emergencies cost lives. Hospitals and patients struggle to find compatible donors quickly. This system provides a centralized platform where:
- Donors can register and mark their availability
- Hospitals/patients can post emergency blood requests
- Anyone can search for available donors by blood type
- Admins can monitor all activity in real time

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Donor** | Register, set availability, record donations, view history, post emergency requests |
| **Admin** | View all users, donations, requests, and system statistics |
| **Public** | Browse open emergency requests, search available donors |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         (localhost:3000)                             │
│  Home │ Login │ Register │ Requests │ Donors │ Admin │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP REST (Axios)
                       │ JWT Bearer Token
┌──────────────────────▼──────────────────────────────┐
│              Spring Boot Backend                     │
│              (localhost:8081)                        │
│  AuthController │ RequestController │ DonorController│
│  DonationController │ AdminController                │
│  ─────────────────────────────────────────────────  │
│  Spring Security + JWT Filter                        │
│  ─────────────────────────────────────────────────  │
│  Service Layer (Business Logic)                      │
│  ─────────────────────────────────────────────────  │
│  JPA Repositories                                    │
└──────────────────────┬──────────────────────────────┘
                       │ JDBC
┌──────────────────────▼──────────────────────────────┐
│                MySQL Database                        │
│         blood_donor_db                               │
│  users │ emergency_requests │ donations              │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Table: `users`
| Column | Type | Description |
|---|---|---|
| id | BIGINT (PK) | Auto-generated ID |
| full_name | VARCHAR | Donor's full name |
| email | VARCHAR (UNIQUE) | Login email |
| password | VARCHAR | BCrypt hashed password |
| role | ENUM | DONOR / ADMIN |
| blood_type | ENUM | A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG |
| phone | VARCHAR | Contact number |
| city | VARCHAR | Location |
| available | BOOLEAN | Donation availability status |
| created_at | DATETIME | Registration timestamp |

### Table: `emergency_requests`
| Column | Type | Description |
|---|---|---|
| id | BIGINT (PK) | Auto-generated ID |
| patient_name | VARCHAR | Name of patient |
| blood_type | ENUM | Required blood type |
| urgency_level | ENUM | LOW / MEDIUM / HIGH / CRITICAL |
| hospital | VARCHAR | Hospital name |
| city | VARCHAR | Hospital city |
| contact_phone | VARCHAR | Contact number |
| description | TEXT | Additional details |
| status | ENUM | OPEN / FULFILLED / CLOSED |
| requested_by | BIGINT (FK) | User who posted the request |
| created_at | DATETIME | Request timestamp |

### Table: `donations`
| Column | Type | Description |
|---|---|---|
| id | BIGINT (PK) | Auto-generated ID |
| donor_id | BIGINT (FK) | Donor user ID |
| request_id | BIGINT (FK) | Linked emergency request (optional) |
| hospital | VARCHAR | Donation hospital |
| notes | TEXT | Additional notes |
| donated_at | DATETIME | Donation timestamp |

---

## 🔗 REST API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Emergency Requests
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/requests` | Public | Get all requests |
| GET | `/api/requests/open` | Public | Get open requests only |
| GET | `/api/requests/{id}` | Public | Get request by ID |
| POST | `/api/requests` | Authenticated | Create new request |
| GET | `/api/requests/my` | Authenticated | Get my requests |
| PATCH | `/api/requests/{id}/status` | Authenticated | Update request status |

### Donors
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/donors` | Public | Get all available donors |
| GET | `/api/donors/search?bloodType=` | Public | Search by blood type |
| PATCH | `/api/donors/availability` | Authenticated | Toggle availability |

### Donations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/donations` | Authenticated | Record a donation |
| GET | `/api/donations/my` | Authenticated | Get my donation history |
| GET | `/api/donations/my/count` | Authenticated | Get my donation count |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | ADMIN only | Get all users |
| GET | `/api/admin/donations` | ADMIN only | Get all donations |
| GET | `/api/admin/stats` | ADMIN only | Get system statistics |

---

## 🔐 Security Implementation

- **Password Hashing** — BCrypt encoder (strength 10)
- **JWT Authentication** — HS256 signed tokens, 24-hour expiry
- **Stateless Sessions** — No server-side session storage
- **Role-Based Access Control** — DONOR vs ADMIN roles
- **CORS Configuration** — Restricted to `http://localhost:3000`
- **Filter Chain** — Custom `JwtFilter` validates token on every request

---

## 📁 Project Structure

```
Knee/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/blooddonor/
│       ├── BloodDonorApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── EmergencyRequestController.java
│       │   ├── DonationController.java
│       │   ├── DonorController.java
│       │   └── AdminController.java
│       ├── dto/
│       │   ├── RegisterRequest.java
│       │   ├── LoginRequest.java
│       │   ├── AuthResponse.java
│       │   ├── EmergencyRequestDto.java
│       │   └── DonationDto.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── EmergencyRequest.java
│       │   └── Donation.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── EmergencyRequestRepository.java
│       │   └── DonationRepository.java
│       ├── security/
│       │   ├── JwtUtil.java
│       │   └── JwtFilter.java
│       └── service/
│           ├── AuthService.java
│           ├── EmergencyRequestService.java
│           ├── DonationService.java
│           └── UserService.java
│
└── frontend/
    └── src/
        ├── App.js
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   └── ProtectedRoute.js
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Requests.js
        │   ├── NewRequest.js
        │   ├── Donors.js
        │   ├── Dashboard.js
        │   └── Admin.js
        └── services/
            └── api.js
```

---

## 🚀 How to Run

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

### Step 1 — Start MySQL
Make sure MySQL is running on port `3306`. The local default connects as `root` with password `Sneha@123` (the credentials originally configured for this project). If your MySQL credentials differ, set `DB_USERNAME` and `DB_PASSWORD` before starting the backend. You can also override the connection URL with `DB_URL`.

### Step 2 — Start Backend
```bash
cd backend
mvn clean spring-boot:run
```
Backend runs on → `http://localhost:8081`  
Database `blood_donor_db` and its tables are auto-created. Set `JWT_SECRET` to a long random value outside local development.

### Step 3 — Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on → `http://localhost:3000`
For a backend hosted at another address, set `REACT_APP_API_URL` (for example, `http://localhost:8081`) before building or starting the frontend. Do not include `/api` in this value.

---

## 🧪 Test Credentials

| Role | Email | Password |
|---|---|---|
Create a donor account from the registration page. Public registration always creates donor accounts. To promote a trusted account to admin, update its role directly in MySQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

---

## ✨ Key Features

- ✅ User registration & login with JWT authentication
- ✅ Post emergency blood requests with urgency levels (LOW / MEDIUM / HIGH / CRITICAL)
- ✅ Search available donors by blood type
- ✅ Toggle donor availability status
- ✅ Record and track donation history
- ✅ Link donations to specific emergency requests
- ✅ Admin dashboard with live statistics
- ✅ Role-based route protection
- ✅ Responsive UI with color-coded urgency badges
- ✅ Toast notifications for all user actions

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.2 | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database ORM |
| Hibernate 6 | JPA implementation |
| JWT (jjwt 0.11.5) | Token-based auth |
| Lombok | Boilerplate reduction |
| MySQL Connector/J | Database driver |
| BCrypt | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Toastify | Notifications |
| Context API | Global state management |

---

## 👨‍💻 Developed By

> Full-Stack Web Application — Java Technologies & Modern Web Development  
> Blood Donor & Emergency Request Management System
