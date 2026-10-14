Add-Type -AssemblyName System.Drawing

function Generate-PwaIcon {
    param (
        [int]$size,
        [string]$outputPath,
        [bool]$isMaskable = $false,
        [bool]$isApple = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size

    # Background gradient
    $color1 = [System.Drawing.Color]::FromArgb(255, 29, 78, 216)   # #1d4ed8 (Deep Blue)
    $color2 = [System.Drawing.Color]::FromArgb(255, 14, 165, 233)  # #0ea5e9 (Sky Blue)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $color1, $color2, 45.0

    if ($isMaskable) {
        # Full fill for maskable
        $g.FillRectangle($brush, $rect)
    } else {
        # Rounded rectangle for regular/apple icon
        $radius = [int]($size * 0.22)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc(0, 0, $d, $d, 180, 90)
        $path.AddArc($size - $d, 0, $d, $d, 270, 90)
        $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
        $path.AddArc(0, $size - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($brush, $path)
    }

    # Draw box & shield graphic
    # Content area sizing
    $contentScale = if ($isMaskable) { 0.55 } else { 0.65 }
    $contentSize = $size * $contentScale
    $offsetX = ($size - $contentSize) / 2
    $offsetY = ($size - $contentSize) / 2

    # Draw white package box
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $boxPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), ([float]($size * 0.04))
    $boxPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Box body
    $boxRect = New-Object System.Drawing.Rectangle ([int]($offsetX + $contentSize * 0.1)), ([int]($offsetY + $contentSize * 0.25)), ([int]($contentSize * 0.8)), ([int]($contentSize * 0.65))
    $boxRadius = [int]($contentSize * 0.12)
    $boxPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $bd = $boxRadius * 2
    $boxPath.AddArc($boxRect.X, $boxRect.Y, $bd, $bd, 180, 90)
    $boxPath.AddArc($boxRect.Right - $bd, $boxRect.Y, $bd, $bd, 270, 90)
    $boxPath.AddArc($boxRect.Right - $bd, $boxRect.Bottom - $bd, $bd, $bd, 0, 90)
    $boxPath.AddArc($boxRect.X, $boxRect.Bottom - $bd, $bd, $bd, 90, 90)
    $boxPath.CloseFigure()
    
    # Soft box fill
    $boxFill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
    $g.FillPath($boxFill, $boxPath)

    # Box tape / stripe
    $tapeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
    $tapeWidth = [int]($contentSize * 0.22)
    $tapeRect = New-Object System.Drawing.Rectangle ([int]($size/2 - $tapeWidth/2)), ($boxRect.Y), $tapeWidth, ($boxRect.Height)
    $g.FillRectangle($tapeBrush, $tapeRect)

    # Box lid flap lines
    $flapPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(200, 203, 213, 225)), ([float]($size * 0.015))
    $g.DrawLine($flapPen, [int]($boxRect.X), [int]($boxRect.Y + $boxRect.Height * 0.2), [int]($boxRect.Right), [int]($boxRect.Y + $boxRect.Height * 0.2))

    # Center shield icon with checkmark
    $shieldPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), ([float]($size * 0.035))
    $shieldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129)) # Emerald-500
    
    $shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $scX = $size / 2
    $scY = $offsetY + $contentSize * 0.58
    $sw = $contentSize * 0.32
    $sh = $contentSize * 0.38

    $pts = @(
        (New-Object System.Drawing.PointF ($scX), ($scY - $sh/2)),
        (New-Object System.Drawing.PointF ($scX + $sw/2), ($scY - $sh/3)),
        (New-Object System.Drawing.PointF ($scX + $sw/2), ($scY + $sh/6)),
        (New-Object System.Drawing.PointF ($scX), ($scY + $sh/2)),
        (New-Object System.Drawing.PointF ($scX - $sw/2), ($scY + $sh/6)),
        (New-Object System.Drawing.PointF ($scX - $sw/2), ($scY - $sh/3))
    )
    $shieldPath.AddPolygon($pts)
    $g.FillPath($shieldBrush, $shieldPath)
    $g.DrawPath($shieldPen, $shieldPath)

    # Checkmark inside shield
    $checkPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([float]($size * 0.03))
    $checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $chk1 = New-Object System.Drawing.PointF ($scX - $sw*0.22), ($scY)
    $chk2 = New-Object System.Drawing.PointF ($scX - $sw*0.05), ($scY + $sh*0.16)
    $chk3 = New-Object System.Drawing.PointF ($scX + $sw*0.25), ($scY - $sh*0.15)
    $g.DrawLine($checkPen, $chk1, $chk2)
    $g.DrawLine($checkPen, $chk2, $chk3)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

Generate-PwaIcon -size 192 -outputPath "public/icons/icon-192x192.png"
Generate-PwaIcon -size 512 -outputPath "public/icons/icon-512x512.png"
Generate-PwaIcon -size 512 -outputPath "public/icons/icon-maskable-512x512.png" -isMaskable $true
Generate-PwaIcon -size 180 -outputPath "public/icons/apple-touch-icon.png" -isApple $true
