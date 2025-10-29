try {
  $r = Invoke-RestMethod -Uri 'http://localhost:3000/products' -Method GET -ErrorAction Stop
  $r | ConvertTo-Json -Depth 5
} catch {
  Write-Output 'FAILED'
  $_ | ConvertTo-Json -Depth 5
}
