# Guide de Test - Messagerie MediConnect

## Résumé des corrections apportées

Le problème "No conversations yet" a été résolu en corrigeant les points suivants:

### 1. Variables d'environnement manquantes
- Ajouté `VITE_MESSAGING_SERVICE_URL=http://localhost:5197/api` dans `frontend/.env`
- Ajouté `VITE_CHAT_HUB_URL=http://localhost:5197/hubs/chat` dans `frontend/.env`

### 2. Création automatique de conversations
- Modifié `AppointmentsController.cs` pour créer automatiquement une conversation quand un rendez-vous est confirmé
- Ajouté `IHttpClientFactory` et `IConfiguration` au controller
- Ajouté la configuration `MessagingService:Url` dans `appsettings.json`

### 3. Configuration Docker
- Ajouté `MessagingService__Url=http://messaging-service:8080/api` au monolith dans docker-compose
- Ajouté les variables d'environnement du messaging service au frontend dans docker-compose

### 4. Endpoint API supplémentaire
- Ajouté `POST /api/Conversations/{id}/messages` pour envoyer des messages via API REST (en plus de SignalR)

---

## Comment tester la messagerie

### Prérequis
- Docker et Docker Compose installés
- Tous les services démarrés

### Démarrer les services

```bash
cd docker
docker-compose up -d
```

### Étape 1: Créer des comptes utilisateurs

#### Créer un compte Patient
```bash
curl -X POST http://localhost:5195/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123",
    "fullName": "Patient Test",
    "role": "Patient"
  }'
```

#### Créer un compte Docteur
```bash
curl -X POST http://localhost:5195/api/Auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "password123",
    "fullName": "Dr. Test",
    "role": "Doctor"
  }'
```

### Étape 2: Se connecter et obtenir le JWT

```bash
# Patient login
curl -X POST http://localhost:5195/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

Notez le `token` retourné.

### Étape 3: Créer un rendez-vous (Patient)

```bash
curl -X POST http://localhost:5195/api/Appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PATIENT_JWT_TOKEN>" \
  -d '{
    "doctorId": "<DOCTOR_USER_ID>",
    "patientId": "<PATIENT_USER_ID>",
    "appointmentDate": "2026-06-10T10:00:00Z",
    "reason": "Consultation générale"
  }'
```

### Étape 4: Confirmer le rendez-vous (Docteur)

```bash
curl -X PUT http://localhost:5195/api/Appointments/<APPOINTMENT_ID>/confirm \
  -H "Authorization: Bearer <DOCTOR_JWT_TOKEN>"
```

**Ceci créera automatiquement une conversation dans le messaging service.**

### Étape 5: Vérifier les conversations (Patient ou Docteur)

```bash
curl -X GET http://localhost:5197/api/Conversations \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Vous devriez voir une conversation avec `patientId` et `doctorId`.

### Étape 6: Envoyer un message via API

```bash
curl -X POST http://localhost:5197/api/Conversations/<CONVERSATION_ID>/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "content": "Bonjour, comment puis-je vous aider?"
  }'
```

### Étape 7: Récupérer les messages d'une conversation

```bash
curl -X GET http://localhost:5197/api/Conversations/<CONVERSATION_ID>/messages \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Test via l'interface Frontend

### 1. Accéder à l'application
Ouvrez `http://localhost:8081` dans votre navigateur.

### 2. Se connecter en tant que Patient
- Email: `patient@test.com`
- Mot de passe: `password123`

### 3. Créer un rendez-vous
- Allez dans la section "Appointments"
- Sélectionnez un docteur
- Choisissez une date et une raison
- Validez

### 4. Confirmer le rendez-vous (en tant que Docteur)
- Déconnectez-vous
- Connectez-vous en tant que docteur: `doctor@test.com`
- Allez dans la section "Appointments"
- Confirmez le rendez-vous du patient

### 5. Tester la messagerie
- Déconnectez-vous et reconnectez-vous en tant que patient
- Allez dans la section "Messages"
- Vous devriez voir la conversation apparaître
- Cliquez sur la conversation
- Envoyez un message
- Le message devrait s'afficher

### 6. Test temps réel (SignalR)
- Ouvrez deux navigateurs différents
- Connectez-vous en tant que patient dans un, docteur dans l'autre
- Allez tous les deux dans la section Messages
- Envoyez un message depuis un compte
- Le message devrait apparaître en temps réel dans l'autre navigateur

---

## Endpoints API disponibles

### Messaging Service (Port 5197)

#### Conversations
- `GET /api/Conversations` - Liste des conversations de l'utilisateur
- `POST /api/Conversations/initiate` - Créer une nouvelle conversation
- `GET /api/Conversations/{id}/messages` - Messages d'une conversation
- `POST /api/Conversations/{id}/messages` - Envoyer un message (REST)

#### SignalR Hub
- `GET /hubs/chat` - Hub SignalR pour messagerie temps réel

### Monolith (Port 5195)

#### Appointments
- `POST /api/Appointments` - Créer un rendez-vous
- `PUT /api/Appointments/{id}/confirm` - Confirmer un rendez-vous (crée automatiquement une conversation)

---

## Dépannage

### "No conversations yet" toujours affiché

1. **Vérifiez que les services sont démarrés**
   ```bash
   docker-compose ps
   ```

2. **Vérifiez les logs du messaging service**
   ```bash
   docker-compose logs messaging-service
   ```

3. **Vérifiez que le rendez-vous a été confirmé**
   - Seuls les rendez-vous confirmés créent des conversations automatiquement

4. **Vérifiez la connexion à la base de données**
   ```bash
   docker-compose exec db psql -U postgres -d messagingservice -c "SELECT * FROM \"Conversations\";"
   ```

### Erreur de connexion SignalR

1. **Vérifiez que le token JWT est valide**
   - Le token doit être passé dans le query string: `?access_token=<TOKEN>`

2. **Vérifiez la configuration CORS**
   - Le messaging service doit autoriser les requêtes depuis le frontend

3. **Vérifiez les logs du navigateur**
   - Ouvrez la console développeur (F12)
   - Cherchez les erreurs WebSocket ou SignalR

### Messages non reçus en temps réel

1. **Vérifiez que les deux utilisateurs sont dans la même conversation**
   - Le `conversationId` doit être identique

2. **Vérifiez que SignalR est connecté**
   - Dans la console du navigateur, vous devriez voir "Connected to Chat Hub"

3. **Vérifiez que le messaging service est accessible**
   ```bash
   curl http://localhost:5197/hubs/chat
   ```

---

## Architecture

```
Frontend (React)
    ↓ HTTP/WebSocket
Messaging Service (ASP.NET Core)
    ↓
PostgreSQL (messagingservice DB)
    ↑
Monolith (ASP.NET Core)
    ↓ HTTP
Messaging Service (pour créer conversation après rendez-vous)
```

### Flux de données

1. **Création de conversation**: Rendez-vous confirmé → Monolith appelle Messaging Service → Conversation créée
2. **Envoi de message**: Frontend → SignalR Hub → Message sauvegardé en DB → Broadcast aux participants
3. **Réception de message**: SignalR Hub → Frontend → UI mise à jour en temps réel
