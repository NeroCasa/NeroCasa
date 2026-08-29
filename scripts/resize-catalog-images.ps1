# Resize catalog product JPGs to exactly 1024x1024 (center crop).
# WARNING: Do not use for NeroCasa storefront assets. Catalog PDPs use original
# theme asset aspect ratios. Crop product media in Shopify Admin instead.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/resize-catalog-images.ps1

Add-Type -AssemblyName System.Drawing

$assetsDir = (Resolve-Path (Join-Path (Join-Path $PSScriptRoot '..') 'assets')).Path
$size = 1024

$files = @(
  'cft-1-ibiza-white.jpg','cft-1-armani-grey.jpg','cft-1-travertine.jpg',
  'cft-2-ibiza-white.jpg','cft-2-armani-grey.jpg','cft-2-travertine.jpg',
  'cft-3-ibiza-white.jpg','cft-3-travertine.jpg','cft-3-rosso-levanto.jpg',
  'cs-1-ibiza-white.jpg','cs-1-armani-grey.jpg','cs-1-travertine.jpg',
  'cs-2-ibiza-white.jpg','cs-2-armani-grey.jpg','cs-2-travertine.jpg',
  'cs-3-ibiza-white.jpg','cs-3-armani-grey.jpg','cs-3-travertine.jpg',
  'sd-1-ibiza-white.jpg','sd-1-armani-grey.jpg','sd-1-travertine.jpg',
  'sd-2-ibiza-white.jpg','sd-2-armani-grey.jpg','sd-2-travertine.jpg',
  'sd-3-ibiza-white.jpg','sd-3-armani-grey.jpg','sd-3-travertine.jpg'
)

function Resize-CoverSquare {
  param(
    [string]$Path,
    [int]$Target
  )

  $src = [System.Drawing.Image]::FromFile($Path)
  try {
    $script:origW = $src.Width
    $script:origH = $src.Height
    if ($src.Width -eq $Target -and $src.Height -eq $Target) {
      return "already ${Target}x${Target}"
    }

    $scale = [Math]::Max($Target / $src.Width, $Target / $src.Height)
    $scaledW = [int][Math]::Round($src.Width * $scale)
    $scaledH = [int][Math]::Round($src.Height * $scale)

    $scaled = New-Object System.Drawing.Bitmap $scaledW, $scaledH
    $g1 = [System.Drawing.Graphics]::FromImage($scaled)
    try {
      $g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g1.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g1.DrawImage($src, 0, 0, $scaledW, $scaledH)
    } finally {
      $g1.Dispose()
    }

    $cropX = [int][Math]::Floor(($scaledW - $Target) / 2)
    $cropY = [int][Math]::Floor(($scaledH - $Target) / 2)

    $out = New-Object System.Drawing.Bitmap $Target, $Target
    $g2 = [System.Drawing.Graphics]::FromImage($out)
    try {
      $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g2.DrawImage($scaled, (New-Object System.Drawing.Rectangle 0, 0, $Target, $Target), (New-Object System.Drawing.Rectangle $cropX, $cropY, $Target, $Target), [System.Drawing.GraphicsUnit]::Pixel)
    } finally {
      $g2.Dispose()
    }

    $scaled.Dispose()

    $tmp = "$Path.tmp"
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
    $out.Save($tmp, $codec, $encoderParams)
    $out.Dispose()
    $src.Dispose()
    $src = $null

    Remove-Item -Force -ErrorAction SilentlyContinue $Path
    Rename-Item -Force $tmp $Path
    return "$($script:origW)x$($script:origH) -> ${Target}x${Target}"
  } finally {
    if ($src) { $src.Dispose() }
  }
}

Write-Host "Resize catalog images to ${size}x${size}`n"

foreach ($name in $files) {
  $path = Join-Path $assetsDir $name
  if (-not (Test-Path $path)) {
    Write-Error "Missing assets/$name"
    exit 1
  }
  $result = Resize-CoverSquare -Path $path -Target $size
  Write-Host "  + $name $result"
}

Write-Host "`nDone.`n"
