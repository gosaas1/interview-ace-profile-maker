# Set your new Supabase values here
$newSupabaseUrl = "https://iqikeltdqmpdsczakril.supabase.co"
$newAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODExODksImV4cCI6MjA2NTE1NzE4OX0.o_c4yk6tKYM17uTXtdepkRWR4PUp71lflaciAcLB6i4"
$newServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU4MTE4OSwiZXhwIjoyMDY1MTU3MTg5fQ.N7V7dsIrCNqMObP0dRCCcn4ZgIVtBZ_qvgWupZAe3kI"

$envPath = "..\\backend\\.env.local"

# Read all lines, or create file if missing
if (Test-Path $envPath) {
    $lines = Get-Content $envPath
} else {
    $lines = @()
}

# Remove any existing Supabase lines (backend keys only)
$filtered = $lines | Where-Object {
    ($_ -notmatch "^SUPABASE_URL=") -and
    ($_ -notmatch "^SUPABASE_ANON_KEY=") -and
    ($_ -notmatch "^SUPABASE_SERVICE_ROLE_KEY=")
}

# Add the correct Supabase lines at the end
$filtered += "SUPABASE_URL=$newSupabaseUrl"
$filtered += "SUPABASE_ANON_KEY=$newAnonKey"
$filtered += "SUPABASE_SERVICE_ROLE_KEY=$newServiceRoleKey"

# Write back to file
$filtered | Set-Content $envPath -Encoding UTF8

Write-Host "Supabase keys updated in $envPath"