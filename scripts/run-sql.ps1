param(
    [Parameter(Mandatory=$true)]
    [string]$SqlFile
)

# Stop execution on error
$ErrorActionPreference = "Stop"

# Get the project root (one level up from scripts directory)
$projectRoot = Split-Path $PSScriptRoot -Parent

# Change to project root directory
Push-Location $projectRoot

try {
    # Check if file exists
    if (-not (Test-Path $SqlFile)) {
        Write-Error "File not found: $SqlFile"
        exit 1
    }

    # Get the container ID
    $containerId = "supabase_db_wyyjgpazdytokciipfdd"

    # Run the specified SQL file
    Write-Host "Running $SqlFile in Supabase container..."
    Get-Content $SqlFile | docker exec -i $containerId psql -U postgres

    # Update schema documentation
    Write-Host "Updating schema documentation..."
    & "$PSScriptRoot/update-schema.ps1"

    Write-Host "Done!"
}
finally {
    # Always restore original directory
    Pop-Location
}
