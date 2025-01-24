param(
    [Parameter(Mandatory=$true)]
    [string]$SqlFile
)

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
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
& "$scriptPath/update-schema.ps1"

Write-Host "Done!"
