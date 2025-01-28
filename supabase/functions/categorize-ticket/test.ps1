  $headers = @{ 
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3d2ptcGpmcXFtbnVnaG5lY2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3OTk4OTEsImV4cCI6MjA1MzM3NTg5MX0.3L_H4C13DG8r5bTLXjHEjDb3GR-bFUgVNafXMkcfoLc"
    "Content-Type" = "application/json" 
}

$data = '{"ticket":"so i got a new phone"}'

Invoke-RestMethod -Uri 'https://bwwjmpjfqqmnughnecem.supabase.co/functions/v1/categorize-ticket' -Method Post -Headers $headers -Body $data