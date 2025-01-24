param(
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "documentation/schema.json"
)

# Get the container ID
$containerId = "supabase_db_wyyjgpazdytokciipfdd"

# Now run DefineSchema.sql and capture its output
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$schemaFile = "$scriptPath/DefineSchema.sql"
if (Test-Path $schemaFile) {
    Write-Host "Generating schema definition..."
    # Use -t to disable table formatting, -A for unaligned output mode
    $schemaJson = Get-Content $schemaFile | docker exec -i $containerId psql -U postgres -t -A
    
    # Create the documentation directory if it doesn't exist
    $docDir = Split-Path $OutputPath -Parent
    if (-not (Test-Path $docDir)) {
        New-Item -ItemType Directory -Path $docDir | Out-Null
    }
    
    # Save the schema JSON to documentation/schema.json
    $schemaJson | ConvertFrom-Json | ConvertTo-Json -Depth 100 | Out-File $OutputPath -Encoding UTF8
    
    Write-Host "Schema saved to $OutputPath"
}
