try {
  $resp = Invoke-WebRequest -Uri 'http://localhost:3000/products' -Method GET -ErrorAction Stop
  Write-Output $resp.Content
} catch {
  Write-Output 'FAILED'
  $_ | ConvertTo-Json -Depth 3
}
