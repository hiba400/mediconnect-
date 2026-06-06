# MediConnect / YomogoMed — Guide d'implémentation bout en bout

Ce guide décrit **chaque fonctionnalité**, l'**API à appeler**, le **code frontend/backend**, la **base de données** et **comment tester**.

## Architecture

| Service | URL locale | Rôle |
|---------|------------|------|
| **Frontend** | http://localhost:8081 | React (Vite + TanStack Router) |
| **Monolith API** | http://localhost:5195/api | Auth, Users, Appointments, AI proxy, DoctorApplications |
| **Doctor Service** | http://localhost:5196/api | Profils médecins |
| **Messaging Service** | http://localhost:5197/api + `/hubs/chat` | Conversations + SignalR |
| **AI Service** | http://localhost:5198/api/v1/ai | Chatbot FastAPI |

Le frontend appelle le monolith via le proxy `/api`. Les autres services via `VITE_*_SERVICE_URL`.

---

## Démarrage pour démo

```powershell
cd docker
docker compose up -d --build
```

Tester le monolith :
```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-monolith.ps1
```

Comptes démo : `doctor@example.com`, `patient@example.com`, `admin@example.com` — mot de passe `password123`

---

# 🔐 AUTHENTIFICATION

## Register (Patient)

| | |
|---|---|
| **Bouton** | Create account (`/register`) |
| **API** | `POST /api/Auth/register` |
| **Body** | `{ fullName, email, password, role: 0 }` |
| **Réponse** | `{ token, id, fullName, email, role }` |
| **DB** | Table `Users` (monolith PostgreSQL) |

**Frontend** (`frontend/src/routes/register.tsx`) :
```typescript
const { user, token } = await registerAccount({
  fullName: data.name,
  email: data.email,
  password: data.password,
  role: 0,
});
setUser(user, token);
navigate({ to: "/patient" });
```

**Backend** (`monolith/.../AuthController.cs`) :
- Hash BCrypt du mot de passe
- Insert dans `ApplicationUser`
- Retourne JWT via `CreateAuthResponse()`

**Test** :
```powershell
Invoke-RestMethod -Uri "http://localhost:5195/api/Auth/register" -Method POST `
  -ContentType "application/json" `
  -Body '{"fullName":"Test","email":"new@test.com","password":"password123","role":0}'
```

**Erreurs** : `400 Email already exists`, mot de passe < 6 caractères

---

## Register Doctor (Apply)

| | |
|---|---|
| **Bouton** | Submit application (`/doctor-apply`) |
| **APIs** | 1. `POST /api/Auth/register` (role: 1) 2. `POST /api/DoctorProfiles/me` (doctor-service) 3. `POST /api/DoctorApplications` |
| **DB** | `Users` + `DoctorProfiles` + `DoctorApplications` |

**Flux** (`frontend/src/routes/doctor-apply.tsx`) :
1. Inscription + JWT
2. `setUser({ role: "doctor" }, token)`
3. Création profil médecin
4. Soumission candidature admin
5. Redirection `/doctor`

**Test** : Compléter les 4 étapes sur http://localhost:8081/doctor-apply

---

## Login

| | |
|---|---|
| **Bouton** | Sign in (`/login`) |
| **API** | `POST /api/Auth/login` |
| **Body** | `{ email, password }` |

**Frontend** (`frontend/src/lib/auth-session.ts`) :
```typescript
const res = await fetchApi("/Auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

**Backend** : Vérifie BCrypt + `IsActive`, génère JWT (claims: id, email, role)

**Test** : Boutons démo Patient/Doctor/Admin sur la page login

---

## Logout

| | |
|---|---|
| **Bouton** | Logout (DashboardShell) |
| **API** | Aucune (stateless JWT) |
| **Action** | `localStorage.removeItem("mediconnect-auth-token")` + `setUser(null)` |

**Fichier** : `frontend/src/store/auth.ts` → `logout()`

---

## Rôles

| Rôle | Valeur enum | Dashboard |
|------|-------------|-----------|
| Patient | 0 | `/patient` |
| Doctor | 1 | `/doctor` |
| Admin | 2 | `/admin` |

Garde : `frontend/src/hooks/useAuthGuard.ts`

---

# 👤 PATIENT

## Rechercher un médecin

| | |
|---|---|
| **Page** | `/patient/doctors` |
| **API** | `GET /api/DoctorProfiles` (doctor-service, JWT requis) |
| **Filtres** | `?specialty=Cardiology&city=Paris` |
| **DB** | `DoctorProfiles` |

**Hook** : `frontend/src/hooks/useDoctors.ts`  
**Mapping** : `frontend/src/lib/doctors.ts` → `normalizeDoctor()`

**Test** : Se connecter en patient → Find doctors → liste depuis l'API

---

## Voir profil médecin

| | |
|---|---|
| **Page** | `/patient/doctors/$id` |
| **API** | `GET /api/DoctorProfiles` (filtre client par `id`) |
| **Bouton Message** | `POST /api/Conversations/initiate` avec `doctorId: userId` (GUID monolith) |

**Important** : Utiliser `userId` (compte monolith), pas `id` (profil doctor-service).

---

## Réserver un rendez-vous

| | |
|---|---|
| **Page** | `/patient/book/$id` |
| **Bouton** | Confirm booking |
| **API** | `POST /api/Appointments` |
| **Body** | `{ patientId, doctorId, appointmentDate, reason }` |
| **DB** | Table `Appointments` |

```typescript
await fetchApi("/Appointments", {
  method: "POST",
  body: JSON.stringify({
    patientId: user.id,
    doctorId: d.userId,  // UserId du médecin !
    appointmentDate: appointmentDate.toISOString(),
    reason: reason || "Consultation",
  }),
});
```

**Test** : Patient → choisir médecin → Book → confirmer → voir dans `/patient/appointments`

---

## Annuler un rendez-vous

| | |
|---|---|
| **Page** | `/patient/appointments` |
| **Bouton** | Cancel |
| **API** | `PUT /api/Appointments/{id}/cancel` |
| **DB** | `Status` → `Cancelled` (2) |

**Hook** : `useCancelAppointment()` dans `hooks/useAppointments.ts`

---

## Voir mes rendez-vous

| | |
|---|---|
| **API** | `GET /api/Appointments/patient/{patientId}` |
| **Hook** | `usePatientAppointments(user.id)` |

---

# 👨‍⚕️ DOCTOR

## Confirmer / Annuler rendez-vous

| | |
|---|---|
| **Page** | `/doctor/appointments` |
| **APIs** | `PUT /api/Appointments/{id}/confirm` · `PUT /api/Appointments/{id}/cancel` |
| **Hook** | `useDoctorAppointments(user.id)` + mutations |

**Test** : Patient réserve → Doctor se connecte → Appointments → ✓ ou ✗

---

## Disponibilités (calendrier)

| Statut | Détail |
|--------|--------|
| **UI** | `/doctor/calendar` — mock |
| **À implémenter** | Entité `DoctorAvailability` + `GET/POST /api/Availability` |

**Phase 2** : Créer table `DoctorAvailability` dans doctor-service avec `DoctorUserId`, `DayOfWeek`, `StartTime`, `EndTime`.

---

## Profil médecin

| | |
|---|---|
| **API** | `PUT /api/DoctorProfiles/{id}` |
| **Page** | `/doctor/profile` — à brancher |

---

# 💬 MESSAGERIE (SignalR)

## Envoyer un message

| | |
|---|---|
| **Pages** | `/patient/messages`, `/doctor/conversations` |
| **Hub** | `POST invoke SendMessage` sur `/hubs/chat?access_token=JWT` |
| **DB** | `Conversations`, `Messages` |

```typescript
await connection.invoke("SendMessage", {
  conversationId: activeConversation.id,
  content: content.trim(),
});
```

**Fichier** : `frontend/src/hooks/useChat.ts`

---

## Réception temps réel

```typescript
newConnection.on("ReceiveMessage", (msg: Message) => { ... });
```

---

## Indicateur "typing"

```typescript
await connection.invoke("NotifyTyping", activeConversation.id);
// Écoute : UserTyping
```

---

## Message lu (read receipt)

```typescript
await connection.invoke("MarkAsRead", conversationId, messageId);
// Écoute : MessageRead → met isRead à true
```

Affichage : `CheckCheck` visible si `m.isRead` (messages envoyés).

---

## Initier conversation

```typescript
POST /api/Conversations/initiate
{ "patientId": "guid", "doctorId": "guid" }
```

---

# 🤖 AI SERVICE

## Envoyer une question

| | |
|---|---|
| **Page** | `/patient/assistant` |
| **API** | `POST /api/Ai/chat` (monolith → FastAPI) |
| **Body** | `{ query: string, chatHistory: [{ role, content }] }` |
| **Réponse** | `{ answer: string }` |

```typescript
const res = await fetchApi("/Ai/chat", {
  method: "POST",
  body: JSON.stringify({ query, chatHistory }),
});
```

**Fichier** : `frontend/src/hooks/useAiChat.ts`

**Gestion erreurs** : Toast + message de secours si AI service down

**Test** : Patient → AI Assistant → poser une question

---

# 🛠️ ADMIN

## Voir candidatures médecins

| | |
|---|---|
| **Page** | `/admin/applications` |
| **API** | `GET /api/DoctorApplications?status=Pending` |
| **DB** | `DoctorApplications` |

**Hook** : `useDoctorApplications()`

---

## Approuver / Rejeter

| | |
|---|---|
| **APIs** | `PUT /api/DoctorApplications/{id}/approve` · `PUT /api/DoctorApplications/{id}/reject` |
| **Auth** | Rôle Admin |

---

## Activer / Désactiver utilisateur

| | |
|---|---|
| **Page** | `/admin/users` |
| **API** | `PUT /api/Users/{id}` avec `{ fullName, email, isActive: true/false }` |
| **Hook** | `useToggleUserActive()` |

Login bloqué si `IsActive = false`.

---

# 🔗 Checklist démo complète

| # | Action | Résultat attendu |
|---|--------|------------------|
| 1 | Register patient | Redirigé `/patient`, token en localStorage |
| 2 | Apply doctor | Redirigé `/doctor`, profil + candidature créés |
| 3 | Patient cherche médecin | Liste API doctor-service |
| 4 | Patient réserve RDV | POST Appointments OK |
| 5 | Doctor confirme RDV | Status → confirmed |
| 6 | Patient annule RDV | Status → cancelled |
| 7 | Patient message doctor | SignalR temps réel |
| 8 | AI Assistant question | Réponse depuis FastAPI |
| 9 | Admin approuve candidature | Status → approved |
| 10 | Admin désactive user | Login refusé |

---

# État d'implémentation (résumé)

| Zone | Statut | Notes |
|------|--------|-------|
| Auth register/login/logout | ✅ | JWT stateless |
| Doctor apply + auto-login | ✅ | Profil + candidature |
| Patient doctors search/book | ✅ | userId corrigé |
| Patient appointments + cancel | ✅ | |
| Doctor appointments confirm/cancel | ✅ | |
| Messagerie send/receive/typing | ✅ | |
| Read receipts | ✅ | MarkAsRead branché |
| AI chat | ✅ | Via monolith proxy |
| Admin applications | ✅ | Nouvelle table |
| Admin activate user | ✅ | isActive |
| Doctor calendar/availability | ⏳ Phase 2 | UI mock |
| Forgot password | ⏳ | Pas d'API |
| Reviews médecins | ⏳ | Mock data |

---

# Fichiers clés modifiés

**Backend**
- `monolith/.../AuthController.cs`
- `monolith/.../DoctorApplicationsController.cs`
- `monolith/.../Entities/DoctorApplication.cs`
- `microservices/doctor-service/.../DoctorProfilesController.cs` (+ `/me`)

**Frontend**
- `frontend/src/routes/doctor-apply.tsx`
- `frontend/src/routes/patient.appointments.tsx`
- `frontend/src/routes/doctor.appointments.tsx`
- `frontend/src/routes/patient.assistant.tsx`
- `frontend/src/routes/admin.applications.tsx`
- `frontend/src/routes/admin.users.tsx`
- `frontend/src/hooks/useChat.ts`
- `frontend/src/hooks/useAppointments.ts`
- `frontend/src/hooks/useAiChat.ts`
- `frontend/src/hooks/useDoctorApplications.ts`

**Tests**
- `scripts/test-monolith.ps1`
