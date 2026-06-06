# Test rapide du monolith MediConnect (http://localhost:5195)
param(
  [string]$BaseUrl = "http://localhost:5195/api"
)

$passed = 0
$failed = 0

function Assert-Ok($name, $script) {
  Write-Host "[TEST] $name" -NoNewline
  try {
    & $script
    Write-Host " OK" -ForegroundColor Green
    $script:passed++
  } catch {
    $msg = $_.ErrorDetails.Message
    if (-not $msg) { $msg = $_.Exception.Message }
    Write-Host " FAIL" -ForegroundColor Red
    Write-Host "       $msg" -ForegroundColor DarkRed
    $script:failed++
  }
}

Write-Host ""
Write-Host "MediConnect Monolith - $BaseUrl"
Write-Host ""

Assert-Ok "API accessible (login doctor)" {
  $script:doctor = Invoke-RestMethod -Uri "$BaseUrl/Auth/login" -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"doctor@example.com","password":"password123"}'
  if (-not $script:doctor.token -or $script:doctor.role -ne "doctor") {
    throw "Reponse login invalide"
  }
}

Assert-Ok "Login admin" {
  $script:admin = Invoke-RestMethod -Uri "$BaseUrl/Auth/login" -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@example.com","password":"password123"}'
  if (-not $script:admin.token) { throw "Token admin manquant" }
}

Assert-Ok "Register nouveau medecin (token retourne)" {
  $email = "test.monolith.{0}@mail.com" -f (Get-Random -Maximum 999999)
  $script:newDoctor = Invoke-RestMethod -Uri "$BaseUrl/Auth/register" -Method POST `
    -ContentType "application/json" `
    -Body (@{
      fullName = "Dr Monolith Test"
      email    = $email
      password = "password123"
      role     = 1
    } | ConvertTo-Json)
  if (-not $script:newDoctor.token -or $script:newDoctor.role -ne "doctor") {
    throw "Register doit retourner token + role doctor"
  }
}

Assert-Ok "Register nouveau patient + login" {
  $email = "patient.monolith.{0}@mail.com" -f (Get-Random -Maximum 999999)
  $reg = Invoke-RestMethod -Uri "$BaseUrl/Auth/register" -Method POST `
    -ContentType "application/json" `
    -Body (@{
      fullName = "Patient Test"
      email    = $email
      password = "password123"
      role     = 0
    } | ConvertTo-Json)
  if (-not $reg.token) { throw "Register patient sans token" }
  $script:patient = Invoke-RestMethod -Uri "$BaseUrl/Auth/login" -Method POST `
    -ContentType "application/json" `
    -Body (@{ email = $email; password = "password123" } | ConvertTo-Json)
  if ($script:patient.role -ne "patient") { throw "Role patient incorrect" }
}

Assert-Ok "GET /Users (admin)" {
  $headers = @{ Authorization = "Bearer $($script:admin.token)" }
  $users = Invoke-RestMethod -Uri "$BaseUrl/Users" -Headers $headers
  if (-not $users -or $users.Count -lt 1) { throw "Liste users vide" }
}

Assert-Ok "GET /Users/{id} (doctor authentifie)" {
  $headers = @{ Authorization = "Bearer $($script:doctor.token)" }
  Invoke-RestMethod -Uri "$BaseUrl/Users/$($script:doctor.id)" -Headers $headers | Out-Null
}

Assert-Ok "GET /Appointments/patient/{id}" {
  $headers = @{ Authorization = "Bearer $($script:patient.token)" }
  Invoke-RestMethod -Uri "$BaseUrl/Appointments/patient/$($script:patient.id)" -Headers $headers | Out-Null
}

Assert-Ok "GET /Appointments/doctor/{id}" {
  $headers = @{ Authorization = "Bearer $($script:doctor.token)" }
  Invoke-RestMethod -Uri "$BaseUrl/Appointments/doctor/$($script:doctor.id)" -Headers $headers | Out-Null
}

Write-Host ""
Write-Host "Resultat : $passed OK, $failed echec(s)"
Write-Host ""
if ($failed -gt 0) { exit 1 }
