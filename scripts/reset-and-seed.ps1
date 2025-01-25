# Stop execution on error
$ErrorActionPreference = "Stop"

Write-Host "1. Resetting database..." -ForegroundColor Cyan
npx supabase db reset

Write-Host "2. Seeding users..." -ForegroundColor Cyan
./seed-users.ps1

Write-Host "3. Updating schema..." -ForegroundColor Cyan
./update-schema.ps1

Write-Host "Done!" -ForegroundColor Green
