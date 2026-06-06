# Test messagerie MediConnect
param(
  [string]$MonolithUrl = "http://localhost:5195/api",
  [string]$MessagingUrl = "http://localhost:5197/api"
)

Write-Host ""
Write-Host "=== Test Messagerie MediConnect ===" -ForegroundColor Cyan
Write-Host ""

# Login patient
try {
  $patient = Invoke-RestMethod -Uri "$MonolithUrl/Auth/login" -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"patient@example.com","password":"password123"}'
  Write-Host "[OK] Login patient" -ForegroundColor Green
} catch {
  Write-Host "[FAIL] Login patient - $($_.ErrorDetails.Message)" -ForegroundColor Red
  Write-Host "       Creer le compte: patient@example.com / password123" -ForegroundColor Yellow
  exit 1
}

# Login doctor
$doctor = Invoke-RestMethod -Uri "$MonolithUrl/Auth/login" -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"doctor@example.com","password":"password123"}'

$patientHeaders = @{ Authorization = "Bearer $($patient.token)" }
$doctorHeaders = @{ Authorization = "Bearer $($doctor.token)" }

# Initiate conversation
try {
  $conv = Invoke-RestMethod -Uri "$MessagingUrl/Conversations/initiate" -Method POST `
    -ContentType "application/json" -Headers $patientHeaders `
    -Body (@{ patientId = $patient.id; doctorId = $doctor.id } | ConvertTo-Json)
  Write-Host "[OK] Conversation creee: $($conv.id)" -ForegroundColor Green
} catch {
  Write-Host "[FAIL] Initiate conversation - $($_.ErrorDetails.Message)" -ForegroundColor Red
  exit 1
}

# List conversations
$list = Invoke-RestMethod -Uri "$MessagingUrl/Conversations" -Headers $patientHeaders
Write-Host "[OK] Patient voit $($list.Count) conversation(s)" -ForegroundColor Green

# Send message via REST
$msg = Invoke-RestMethod -Uri "$MessagingUrl/Conversations/$($conv.id)/messages" -Method POST `
  -ContentType "application/json" -Headers $patientHeaders `
  -Body '{"content":"Hello doctor, test message"}'
Write-Host "[OK] Message envoye: $($msg.content)" -ForegroundColor Green

# Get messages
$msgs = Invoke-RestMethod -Uri "$MessagingUrl/Conversations/$($conv.id)/messages" -Headers $doctorHeaders
Write-Host "[OK] Doctor voit $($msgs.Count) message(s)" -ForegroundColor Green

Write-Host ""
Write-Host "Messagerie OK - testez dans le navigateur: http://localhost:8081/patient/messages" -ForegroundColor Green
Write-Host ""
