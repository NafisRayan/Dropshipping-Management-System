# Runtime test script for auth and products endpoints (run in a NEW PowerShell)
$body = @{ email='test+ai@example.com'; password='password' } | ConvertTo-Json

try {
  $r = Invoke-RestMethod -Uri 'http://localhost:3000/auth/register' -Method POST -ContentType 'application/json' -Body $body -ErrorAction Stop
  Write-Output 'REGISTER_RESPONSE:'
  $r | ConvertTo-Json -Depth 5
} catch {
  Write-Output 'REGISTER_FAILED:'
  $_ | ConvertTo-Json -Depth 5
}

try {
  $login = Invoke-RestMethod -Uri 'http://localhost:3000/auth/login' -Method POST -ContentType 'application/json' -Body $body -ErrorAction Stop
  Write-Output 'LOGIN_RESPONSE:'
  $login | ConvertTo-Json -Depth 5
} catch {
  Write-Output 'LOGIN_FAILED:'
  $_ | ConvertTo-Json -Depth 5
}

try {
  $tok = $login.access_token
  if (-not $tok) { $tok = $r.access_token }
  if ($tok) {
    Write-Output 'TOKEN_PRESENT'
    Invoke-RestMethod -Uri 'http://localhost:3000/products' -Headers @{ Authorization = "Bearer $tok" } -Method GET | ConvertTo-Json -Depth 5
  } else {
    Write-Output 'NO_TOKEN'
  }
} catch {
  Write-Output 'PRODUCTS_CALL_FAILED:'
  $_ | ConvertTo-Json -Depth 5
}

# Port check
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,State,OwningProcess | ConvertTo-Json -Depth 5
