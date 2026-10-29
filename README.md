# MediConnect – Healthcare Appointment Platform

**Microservices | ASP.NET Core | React | PostgreSQL | SignalR | Docker**

A full-stack healthcare platform enabling patients to search for doctors, book appointments, communicate via real-time messaging, and access AI-powered medical assistance. Built with a microservices architecture demonstrating professional software engineering practices.

## Project Overview

MediConnect is a modern healthcare management system that connects patients with healthcare providers through an intuitive web interface. The platform implements role-based access control, real-time communication, and automated appointment management.

### Key Features

- **Multi-Role Authentication**: Patient, Doctor, and Admin roles with JWT-based stateless authentication
- **Doctor Directory**: Search and filter doctors by specialty and location
- **Appointment Management**: Book, confirm, cancel, and track medical appointments
- **Real-Time Messaging**: SignalR-powered chat between patients and doctors with read receipts
- **AI Medical Assistant**: Integrated AI chatbot for basic medical queries (FastAPI backend)
- **Doctor Applications**: Admin approval workflow for new doctor registrations
- **User Management**: Admin control panel for user activation and deactivation

## Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | ASP.NET Core 10.0, Entity Framework Core, .NET 10 |
| **Frontend** | React 19, TypeScript, Vite, TanStack Router, TanStack Query |
| **Database** | PostgreSQL 16 |
| **Real-Time** | SignalR (ASP.NET Core) |
| **AI Service** | FastAPI (Python) |
| **Authentication** | JWT Bearer Tokens, BCrypt |
| **DevOps** | Docker, Docker Compose |
| **Styling** | Tailwind CSS 4, Radix UI |
| **State Management** | Zustand, TanStack Query |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    http://localhost:8081                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Monolith   │ │ Doctor       │ │  Messaging   │ │  AI Service  │
│   API        │ │ Service      │ │  Service     │ │  (FastAPI)   │
│  :5195       │ │  :5196       │ │  :5197       │ │  :5198       │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────────────┘
       │                │                │
       └────────────────┴────────────────┘
                       │
                       ▼
              ┌──────────────┐
              │  PostgreSQL  │
              │   :5432      │
              └──────────────┘
```

### Services

| Service | Port | Responsibility |
|---------|------|----------------|
| **Frontend** | 8081 | React SPA with TanStack Router |
| **Monolith API** | 5195 | Auth, Users, Appointments, AI proxy, Doctor Applications |
| **Doctor Service** | 5196 | Doctor profiles and search |
| **Messaging Service** | 5197 | Conversations and SignalR Hub |
| **AI Service** | 5198 | FastAPI chatbot backend |
| **PostgreSQL** | 5432 | Multi-database (mediconnect, doctorservice, messagingservice) |

## Repository Structure

```text
mediconnect-/
├── docker/                          # Docker orchestration
│   ├── docker-compose.yml          # Multi-service composition
│   ├── create_test_user.sql        # Database seeding
│   └── start-backend.ps1           # Backend startup script
├── frontend/                       # React TypeScript application
│   ├── src/
│   │   ├── routes/                # TanStack Router pages
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utilities and API clients
│   │   ├── store/                 # Zustand state management
│   │   └── components/            # Reusable UI components
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── monolith/                       # ASP.NET Core monolith API
│   ├── MediConnect.API/           # Main API project
│   ├── MediConnect.Domain/        # Domain entities and interfaces
│   ├── MediConnect.Infrastructure/ # EF Core and services
│   ├── Dockerfile
│   └── MediConnect.slnx
├── microservices/                  # Microservice backends
│   ├── doctor-service/            # Doctor profiles microservice
│   │   ├── DoctorService.API/
│   │   └── DoctorService.slnx
│   ├── messaging-service/         # Real-time messaging microservice
│   │   ├── MessagingService.API/
│   │   └── MessagingService.slnx
│   └── ai-service/                # AI chatbot microservice
│       ├── app/
│       ├── Dockerfile
│       └── requirements.txt
├── scripts/                        # Testing and automation scripts
│   ├── test-monolith.ps1
│   └── test-messaging.ps1
├── docs/                           # Documentation
│   └── MESSAGING_GUIDE.md
├── .github/workflows/              # CI/CD pipelines
│   └── ci.yml
├── IMPLEMENTATION_GUIDE.md        # French implementation guide
├── MESSAGING_GUIDE.md              # French messaging guide
└── README.md                      # This file
```

## Installation

### Prerequisites

- Docker and Docker Compose
- .NET 10.0 SDK (for local development)
- Node.js 22 (for local frontend development)
- PostgreSQL client (optional, for direct DB access)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/hiba400/mediconnect-.git
   cd mediconnect-
   ```

2. **Start all services**
   ```bash
   cd docker
   docker compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8081
   - Monolith API: http://localhost:5195/api
   - Doctor Service: http://localhost:5196/api
   - Messaging Service: http://localhost:5197/api
   - AI Service: http://localhost:5198

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@example.com | password123 |
| Doctor | doctor@example.com | password123 |
| Admin | admin@example.com | password123 |

### Local Development

#### Backend (Monolith)

```bash
cd monolith/MediConnect.API
dotnet restore
dotnet run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### AI Service

```bash
cd microservices/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Configuration

### Environment Variables

Create `.env` files for each service based on the provided examples:

**Frontend (.env)**:
```env
VITE_API_URL=/api
VITE_DOCTOR_SERVICE_URL=http://localhost:5196/api
VITE_MESSAGING_SERVICE_URL=/api
VITE_CHAT_HUB_URL=http://localhost:5197/hubs/chat
```

**Docker Compose** sets these automatically. For local development, configure `appsettings.json` in each API project.

### Database Connection

Update connection strings in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=mediconnect;Username=postgres;Password=your_password"
}
```

### JWT Configuration

Update JWT settings in `appsettings.json`:

```json
"Jwt": {
  "Key": "your-super-secret-key-change-in-production",
  "Issuer": "MediConnect",
  "Audience": "MediConnectUsers",
  "DurationInMinutes": 60
}
```

## API Documentation

### Authentication Endpoints

#### Register Patient
```http
POST /api/Auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": 0
}
```

#### Login
```http
POST /api/Auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Appointment Endpoints

#### Book Appointment
```http
POST /api/Appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": "patient-guid",
  "doctorId": "doctor-guid",
  "appointmentDate": "2026-06-10T10:00:00Z",
  "reason": "General consultation"
}
```

#### Confirm Appointment
```http
PUT /api/Appointments/{id}/confirm
Authorization: Bearer <token>
```

### Messaging Endpoints

#### Get Conversations
```http
GET /api/Conversations
Authorization: Bearer <token>
```

#### Send Message (SignalR)
```javascript
connection.invoke("SendMessage", {
  conversationId: "guid",
  content: "Hello"
});
```

For complete API documentation, see `IMPLEMENTATION_GUIDE.md`.

## Features by Role

### Patient
- Search doctors by specialty and location
- View doctor profiles
- Book appointments
- Cancel appointments
- View appointment history
- Real-time messaging with doctors
- AI medical assistant

### Doctor
- View patient appointments
- Confirm or cancel appointments
- Real-time messaging with patients
- View and update profile
- View appointment history

### Admin
- Review doctor applications
- Approve or reject doctor applications
- Activate or deactivate user accounts
- View all users
- System administration

## Real-Time Messaging

The platform uses SignalR for real-time communication:

- **Instant messaging** between patients and doctors
- **Typing indicators** for better UX
- **Read receipts** to confirm message delivery
- **Automatic conversation creation** when appointments are confirmed

Test messaging with:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-messaging.ps1
```

## AI Assistant

The AI service provides basic medical information:

- Powered by FastAPI
- Accessible via monolith proxy at `/api/Ai/chat`
- Context-aware conversations with chat history
- Graceful fallback when service is unavailable

## Testing

### Manual Testing Scripts

```powershell
# Test monolith API
powershell -ExecutionPolicy Bypass -File scripts/test-monolith.ps1

# Test messaging service
powershell -ExecutionPolicy Bypass -File scripts/test-messaging.ps1
```

### Test Checklist

1. Register new patient account
2. Apply for doctor account
3. Search for doctors
4. Book appointment as patient
5. Confirm appointment as doctor
6. Send message via SignalR
7. Test AI assistant
8. Approve doctor application as admin
9. Deactivate user as admin

## CI/CD

GitHub Actions workflow builds and tests:

- Monolith API (.NET 10)
- Doctor Service (.NET 10)
- Frontend (Node.js 22)

Workflow file: `.github/workflows/ci.yml`

## Security Considerations

- **JWT Authentication**: Stateless tokens with configurable expiration
- **Password Hashing**: BCrypt for secure password storage
- **Role-Based Access**: Three-tier role system (Patient, Doctor, Admin)
- **CORS Configuration**: Cross-origin restrictions enforced
- **SQL Injection Prevention**: Parameterized queries via Entity Framework Core
- **Input Validation**: FluentValidation for DTOs

**Important**: Change default JWT keys and database passwords before production deployment.

## Troubleshooting

### Services Won't Start

```bash
# Check Docker logs
docker compose logs

# Restart specific service
docker compose restart monolith
```

### Database Connection Issues

Ensure PostgreSQL is running and accessible:
```bash
docker compose ps db
docker compose logs db
```

### SignalR Connection Failed

1. Verify JWT token is valid
2. Check CORS configuration
3. Ensure messaging service is running
4. Check browser console for WebSocket errors

### No Conversations Appear

1. Ensure appointment is confirmed (conversations auto-create on confirmation)
2. Verify JWT token in localStorage
3. Check messaging service logs
4. See `docs/MESSAGING_GUIDE.md` for detailed troubleshooting

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication (Register/Login/Logout) | ✅ Complete | JWT stateless |
| Doctor Application Workflow | ✅ Complete | Auto-login after approval |
| Patient Doctor Search | ✅ Complete | Filter by specialty/city |
| Appointment Booking | ✅ Complete | Full CRUD operations |
| Appointment Confirmation | ✅ Complete | Doctor approval workflow |
| Real-Time Messaging | ✅ Complete | SignalR with read receipts |
| AI Chatbot | ✅ Complete | FastAPI integration |
| Admin Doctor Applications | ✅ Complete | Approval workflow |
| Admin User Management | ✅ Complete | Activate/deactivate users |
| Doctor Calendar/Availability | ⏳ Planned | Phase 2 implementation |
| Password Reset | ⏳ Planned | Email integration needed |
| Doctor Reviews | ⏳ Planned | Rating system needed |

## Future Enhancements

- Doctor availability management with calendar integration
- Email-based password reset functionality
- Patient review system for doctors
- Video consultation integration
- Electronic health records (EHR) integration
- Mobile application (React Native)
- Advanced AI diagnostics integration
- Payment processing for appointments

## License

No license has been selected for this project. All rights reserved to the author.

## Author

**Hiba Ben Adou**

Computer Engineering Student – ENSA Tangier

This project demonstrates full-stack development, microservices architecture, real-time communication, and AI integration in a healthcare context.
