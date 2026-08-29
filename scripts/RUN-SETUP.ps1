# Opens Shopify Admin pages to create the API token, then you paste the token here.

Write-Host "`n=== NeroCasa Shopify Setup ===`n"
Write-Host "Step 1: Opening Shopify Admin in your browser..."
Start-Process "https://admin.shopify.com/store/zhjbdz-yw/settings/apps/development"

Write-Host @"

In the browser that just opened:

  1. Click "Build apps in Dev Dashboard" OR "Allow custom app development"
  2. Create an app (name it "NeroCasa Setup")
  3. Click "Configure Admin API scopes" and enable:
       - write_products, read_products
       - write_content, read_content
  4. Save → Install app → Reveal token once
  5. Copy the token (starts with shpat_)

"@

$token = Read-Host "Paste your Admin API token here"
if ([string]::IsNullOrWhiteSpace($token)) {
  Write-Host "No token entered. Exiting." -ForegroundColor Red
  exit 1
}

$env:SHOPIFY_ADMIN_TOKEN = $token.Trim()
Set-Location (Split-Path $PSScriptRoot -Parent)
node scripts/setup-shopify-catalog-token.mjs zhjbdz-yw.myshopify.com

Write-Host "`nPress Enter to close..."
Read-Host | Out-Null
