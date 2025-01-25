# Array of test users
$users = @(
    @{
        email = "user1@example.com"
        password = "password1"
    },
    @{
        email = "user2@example.com"
        password = "password2"
    }
)

# Stop execution on error
$ErrorActionPreference = "Stop"

# Get the project root (one level up from scripts directory)
$projectRoot = Split-Path $PSScriptRoot -Parent

# Change to project root directory
Push-Location $projectRoot

try {
    # Function to read .env file
    function Read-EnvFile {
        param (
            [string]$EnvPath
        )
        
        $fullPath = Join-Path $projectRoot $EnvPath
        Write-Host "Attempting to read environment file: $fullPath" -ForegroundColor Cyan
        
        if (Test-Path $fullPath) {
            Write-Host "Found $EnvPath file" -ForegroundColor Green
            $lineNumber = 0
            Get-Content $fullPath | ForEach-Object {
                $lineNumber++
                if ($_ -match '^\s*#') {
                    Write-Host "Line ${lineNumber}: Skipping comment" -ForegroundColor Gray
                }
                elseif ($_ -match '^\s*$') {
                    Write-Host "Line ${lineNumber}: Skipping empty line" -ForegroundColor Gray
                }
                elseif ($_ -match '^\s*([^#][^=]+)=(.*)$') {
                    $key = $matches[1].Trim()
                    $value = $matches[2].Trim()
                    # Remove surrounding quotes if they exist
                    $value = $value -replace '^[''"]|[''"]$'
                    [System.Environment]::SetEnvironmentVariable($key, $value)
                    Write-Host "Line ${lineNumber}: Loaded environment variable: $key" -ForegroundColor Green
                }
                else {
                    Write-Host "Line ${lineNumber}: Invalid format, skipping: $_" -ForegroundColor Yellow
                }
            }
            Write-Host "Finished loading environment variables from $EnvPath" -ForegroundColor Green
        } else {
            Write-Host "Warning: No .env file found at $fullPath" -ForegroundColor Yellow
        }
        Write-Host "" # Empty line for better readability
    }

    # Check current git branch
    $currentBranch = git -C $projectRoot rev-parse --abbrev-ref HEAD
    Write-Host "Current Git Branch: $currentBranch" -ForegroundColor Cyan

    # Check Supabase status
    Write-Host "`nChecking Supabase Status:" -ForegroundColor Cyan
    npx supabase status

    # Check if required tools are installed
    if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
        throw "Node.js is not installed. Please install Node.js first."
    }

    if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
        throw "npm is not installed. Please install Node.js first."
    }

    # Install required dependencies if they don't exist
    if (-not (Test-Path "node_modules/@supabase/supabase-js")) {
        Write-Host "Installing @supabase/supabase-js..."
        npm install @supabase/supabase-js
    }

    # Try to load environment variables from .env file
    Read-EnvFile ".env"

    # Check for required environment variables
    if (-not $env:VITE_SUPABASE_URL) {
        throw "VITE_SUPABASE_URL environment variable is not set. Please check your .env file"
    }

    if (-not $env:VITE_SUPABASE_ANON_KEY) {
        throw "VITE_SUPABASE_ANON_KEY environment variable is not set. Please check your .env file"
    }

    Write-Host "`nConnection Details:" -ForegroundColor Cyan
    Write-Host "Supabase URL: $env:VITE_SUPABASE_URL" -ForegroundColor Yellow

    Write-Host "`nRunning user seed script..."
    node "$PSScriptRoot/seed-users.js"
}
finally {
    # Always restore original directory
    Pop-Location
}
