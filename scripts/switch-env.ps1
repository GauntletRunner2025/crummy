# Function to backup current .env
function Backup-EnvFile {
    if (Test-Path "../.env") {
        Copy-Item "../.env" "../.env.backup"
        Write-Host "Backed up current .env to .env.backup" -ForegroundColor Green
    }
}

# Function to set environment to local or production
function Set-Environment {
    param (
        [string]$Environment
    )

    Backup-EnvFile

    if ($Environment -eq "local") {
        @"
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
"@ | Set-Content "../.env"
        Write-Host "Switched to local development environment" -ForegroundColor Green
    }
    elseif ($Environment -eq "prod") {
        if (Test-Path "../.env.backup") {
            Copy-Item "../.env.backup" "../.env"
            Write-Host "Restored production environment from backup" -ForegroundColor Green
        }
        else {
            Write-Host "No production backup found. Please set production values manually." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "Invalid environment. Use 'local' or 'prod'" -ForegroundColor Red
    }
}

# Check command line argument
if ($args.Count -eq 0) {
    Write-Host "Please specify environment: local or prod" -ForegroundColor Yellow
    Write-Host "Usage: ./switch-env.ps1 local|prod" -ForegroundColor Yellow
    exit 1
}

Set-Environment $args[0]
