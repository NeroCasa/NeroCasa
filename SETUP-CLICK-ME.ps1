# NeroCasa — One-click Shopify setup (opens browser for you)
# Double-click this file OR run in PowerShell

$Store = "zhjbdz-yw.myshopify.com"
$Root = Split-Path $PSScriptRoot -Parent

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  NeroCasa — Automatic Shopify Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "STEP 1: Log into Shopify in the browser window..." -ForegroundColor Yellow
Start-Process "https://admin.shopify.com/store/zhjbdz-yw/settings/apps/development"

Write-Host @"

When the browser opens:
  1. Log in to Shopify if asked
  2. Click "Build apps in Dev Dashboard" or "Allow custom app development"
  3. Create app → name: NeroCasa Setup
  4. Admin API scopes → enable:
       read_products, write_products, read_content, write_content
  5. Save → Install app → Reveal token once
  6. Copy token (must start with shpat_)

"@

$token = Read-Host "Paste shpat_ token here"
if ($token -notmatch '^shpat_') {
  Write-Host "`nThat is not an Admin API token. It must start with shpat_" -ForegroundColor Red
  Write-Host "The shpss_ token you had before will NOT work.`n" -ForegroundColor Red
  pause
  exit 1
}

Write-Host "`nCreating collections, products, and pages..." -ForegroundColor Green
$env:SHOPIFY_ADMIN_TOKEN = $token.Trim()
Set-Location $Root
node scripts/setup-shopify-catalog-token.mjs $Store

if ($LASTEXITCODE -eq 0) {
  Write-Host "`nSUCCESS! Open your store and press Ctrl+F5 to refresh.`n" -ForegroundColor Green
} else {
  Write-Host "`nSetup failed. Check the error above.`n" -ForegroundColor Red
}

pause
