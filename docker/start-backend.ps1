# Démarre la base de données et l'API principale (auth, rendez-vous, etc.)
Set-Location $PSScriptRoot
Write-Host "Démarrage du backend MediConnect (PostgreSQL + API sur http://localhost:5195)..." -ForegroundColor Cyan
docker compose up -d db monolith --build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Start-Sleep -Seconds 4
try {
  $r = Invoke-RestMethod -Uri "http://localhost:5195/api/Auth/login" -Method POST `
    -ContentType "application/json" -Body '{"email":"doctor@example.com","password":"password123"}'
  Write-Host "OK — API accessible (compte démo: doctor@example.com / password123)" -ForegroundColor Green
} catch {
  Write-Host "Le conteneur démarre encore. Réessayez dans 10 s ou: docker logs mediconnect-monolith" -ForegroundColor Yellow
}
