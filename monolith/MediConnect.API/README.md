# MediConnect Backend API

## Technologies

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- JWT Authentication

---

# Setup

## 1. Clone project

```bash
git clone <repo-url>
```

---

## 2. Configure database

Open:

```plaintext
appsettings.json
```

Update connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=MediConnectDb;Username=postgres;Password=YOUR_PASSWORD"
}
```

---

## 3. Run migrations

```bash
dotnet ef database update --project MediConnect.Infrastructure --startup-project MediConnect.API
```

---

## 4. Run API

```bash
cd MediConnect.API

dotnet run
```

---

# Authentication

JWT Bearer Authentication is used.

---

# Main Endpoints

## Auth

### Register

POST

```http
/api/Auth/register
```

### Login

POST

```http
/api/Auth/login
```

---

## Users

```http
/api/Users
```

---

## Doctors

```http
/api/Doctors
```

---

## Appointments

```http
/api/Appointments
```

---

# Roles

- Admin
- Doctor
- Patient

---

# Project Structure

```plaintext
MediConnect.API
MediConnect.Domain
MediConnect.Infrastructure
MediConnect.Application
```