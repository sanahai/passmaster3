Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public/logo.png").Path
$assetsDir = Join-Path (Get-Location).Path "assets"
if (-not (Test-Path $assetsDir)) { New-Item -ItemType Directory -Path $assetsDir | Out-Null }

$src = [System.Drawing.Image]::FromFile($srcPath)

function New-Canvas($size, $file, $coverage, $bgHex) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml($bgHex))

    $maxW = $size * $coverage
    $maxH = $size * $coverage
    $ratio = [Math]::Min($maxW / $src.Width, $maxH / $src.Height)
    $w = [int]($src.Width * $ratio)
    $h = [int]($src.Height * $ratio)
    $x = [int](($size - $w) / 2)
    $y = [int](($size - $h) / 2)
    $g.DrawImage($src, $x, $y, $w, $h)

    $bmp.Save((Join-Path $assetsDir $file), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output "saved assets/$file ($size x $size)"
}

# 앱 아이콘 소스 (1024, 로고 80%)
New-Canvas 1024 "icon-only.png"        0.80 "#FFFFFF"
# 안드로이드 적응형 아이콘 전경/배경
New-Canvas 1024 "icon-foreground.png"  0.62 "#00000000"
New-Canvas 1024 "icon-background.png"  1.00 "#FFFFFF"
# 스플래시 (2732, 로고 32%)
New-Canvas 2732 "splash.png"           0.32 "#FFFFFF"
New-Canvas 2732 "splash-dark.png"      0.32 "#121212"

$src.Dispose()
Write-Output "DONE"
