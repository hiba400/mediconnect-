# Guide Messagerie — MediConnect

## Pourquoi "No conversations yet" ?

| Cause | Symptom | Solution |
|-------|---------|----------|
| **Aucune conversation en base** | API retourne `[]` | Patient clique "Message Dr..." ou confirme un RDV |
| **JWT invalide / absent** | Erreur 401 (masquée avant) | Se reconnecter ; vérifier `mediconnect-auth-token` dans localStorage |
| **Mauvaise URL messaging** | Network error / CORS | Utiliser le proxy `/messaging-api` (voir `.env`) |
| **Compte démo patient absent** | Login `patient@example.com` échoue | Register ou redémarrer monolith (seed auto) |

## Architecture

```
React (useChat.ts)
  ├─ GET  /messaging-api/Conversations          → liste
  ├─ GET  /messaging-api/Conversations/{id}/messages
  ├─ POST /messaging-api/Conversations/initiate   → créer fil
  ├─ POST /messaging-api/Conversations/{id}/messages  → envoi REST (fallback)
  └─ WS   /hubs/chat?access_token=JWT            → SignalR temps réel
```

## Endpoints backend (Messaging Service)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/Conversations` | JWT | Conversations de l'utilisateur connecté |
| GET | `/api/Conversations/{id}/messages` | JWT | Historique messages |
| POST | `/api/Conversations/initiate` | JWT | `{ patientId, doctorId }` |
| POST | `/api/Conversations/{id}/messages` | JWT | `{ content }` |
| SignalR | `/hubs/chat` | JWT query | `SendMessage`, `NotifyTyping`, `MarkAsRead` |

## Création automatique après RDV confirmé

Quand le médecin confirme un RDV (`PUT /api/Appointments/{id}/confirm`), le monolith appelle :

```
POST http://messaging-service:8080/api/Conversations/initiate
Authorization: Bearer {jwt du médecin}
{ "patientId": "...", "doctorId": "..." }
```

## Test rapide (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-messaging.ps1
```

## Test manuel dans le navigateur

1. Ouvrir http://localhost:8081/login
2. Se connecter en **patient** (`patient@example.com` / `password123`)
3. Aller sur **Messages**
4. Si vide → cliquer **Message Dr. Sarah Smith**
5. Envoyer un message
6. Se connecter en **doctor** → **Conversations** → voir le message

## Vérifier JWT dans DevTools

1. F12 → Application → Local Storage → `mediconnect-auth-token`
2. Network → requête `/messaging-api/Conversations` → Header `Authorization: Bearer ...`
3. Status doit être **200**, pas 401

## Rebuild après modifications

```powershell
cd docker
docker compose up -d --build messaging-service monolith frontend
```
