# NeroCasa Shopify catalog setup (Windows)
# Usage: .\scripts\setup-shopify-catalog.ps1 your-store.myshopify.com

param(
  [Parameter(Mandatory = $true)]
  [string]$Store
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
node scripts/setup-shopify-catalog.mjs $Store
