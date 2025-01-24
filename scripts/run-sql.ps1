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

Write-Host "Running $SqlFile in Supabase container..."
Get-Content $SqlFile | docker exec -i $containerId psql -U postgres

Write-Host "Done!"
