param(
  [Parameter(Mandatory = $true)] [string]$TikTokClientId,
  [Parameter(Mandatory = $true)] [string]$TikTokClientSecret
)

$ErrorActionPreference = "Stop"

function Get-RandomSecret([int]$Length = 48) {
  $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $bytes = New-Object byte[] ($Length)
  $rng.GetBytes($bytes)
  $builder = New-Object System.Text.StringBuilder
  foreach ($b in $bytes) {
    [void]$builder.Append($chars[$b % $chars.Length])
  }
  return $builder.ToString()
}

function Get-CloudflaredPath {
  $cmd = Get-Command cloudflared -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $candidate = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter cloudflared.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($candidate) {
    return $candidate.FullName
  }

  throw "cloudflared executable not found."
}

function Wait-ForTunnelUrl([string[]]$LogPaths, [int]$TimeoutSeconds = 60) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    foreach ($path in $LogPaths) {
      if (Test-Path $path) {
        $match = Select-String -Path $path -Pattern 'https://[-a-z0-9]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($match) {
          return $match.Matches[0].Value
        }
      }
    }

    Start-Sleep -Seconds 2
  }

  throw "Timed out waiting for a Cloudflare tunnel URL."
}

function Wait-ForHttp200([string]$Url, [int]$TimeoutSeconds = 180) {
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        return
      }
    }
    catch {
    }

    Start-Sleep -Seconds 5
  }

  throw "Timed out waiting for Postiz to answer on $Url"
}

if (-not (Get-Command wsl -ErrorAction SilentlyContinue)) {
  throw "WSL is required but not available."
}

$dockerCheck = & wsl -e bash -lc "docker ps >/dev/null 2>&1"
if ($LASTEXITCODE -ne 0) {
  throw "Docker in WSL is not available or the daemon is not running."
}

$cloudflaredPath = Get-CloudflaredPath
$productionDir = (Resolve-Path (Join-Path $PSScriptRoot ".")).Path
$templatePath = Join-Path $productionDir ".env.production.example"
$envPath = Join-Path $productionDir ".env.production"
$tmpEnvDir = Join-Path $productionDir "tmp-env"
$tmpEnvPath = Join-Path $tmpEnvDir ".env"
$logToken = [guid]::NewGuid().ToString("N")
$logPath = Join-Path $env:TEMP ("cloudflared-" + $logToken + ".log")
$errLogPath = Join-Path $env:TEMP ("cloudflared-" + $logToken + ".err.log")

Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

$tunnelProcess = Start-Process -FilePath $cloudflaredPath -ArgumentList @("tunnel", "--url", "http://127.0.0.1:5000", "--no-autoupdate") -RedirectStandardOutput $logPath -RedirectStandardError $errLogPath -PassThru -WindowStyle Hidden

$publicUrl = Wait-ForTunnelUrl -LogPaths @($logPath, $errLogPath)
$domain = $publicUrl -replace '^https://', ''

$jwtSecret = Get-RandomSecret 64
$postizDbPassword = 'postiz-password'
$temporalDbPassword = 'temporal'

$content = Get-Content $templatePath -Raw
$content = $content.Replace("POSTIZ_DOMAIN=postiz.example.com", "POSTIZ_DOMAIN=" + $domain)
$content = $content.Replace("POSTIZ_EMAIL=admin@example.com", "POSTIZ_EMAIL=admin@" + $domain)
$content = $content.Replace("MAIN_URL=https://postiz.example.com", "MAIN_URL=" + $publicUrl)
$content = $content.Replace("FRONTEND_URL=https://postiz.example.com", "FRONTEND_URL=" + $publicUrl)
$content = $content.Replace("NEXT_PUBLIC_BACKEND_URL=https://postiz.example.com/api", "NEXT_PUBLIC_BACKEND_URL=" + $publicUrl + "/api")
$content = $content.Replace("JWT_SECRET=replace-with-a-long-random-secret", "JWT_SECRET=" + $jwtSecret)
$content = $content.Replace("POSTIZ_DB_USER=postiz-user", "POSTIZ_DB_USER=postiz-user")
$content = $content.Replace("POSTIZ_DB_PASSWORD=replace-with-db-password", "POSTIZ_DB_PASSWORD=" + $postizDbPassword)
$content = $content.Replace("DATABASE_URL=postgresql://postiz-user:replace-with-db-password@postiz-postgres:5432/postiz-prod", "DATABASE_URL=postgresql://postiz-user:" + $postizDbPassword + "@postiz-postgres:5432/postiz-prod")
$content = $content.Replace("POSTIZ_DB_NAME=postiz-prod", "POSTIZ_DB_NAME=postiz-prod")
$content = $content.Replace("REDIS_URL=redis://postiz-redis:6379", "REDIS_URL=redis://postiz-redis:6379")
$content = $content.Replace("TEMPORAL_DB_PASSWORD=replace-with-temporal-db-password", "TEMPORAL_DB_PASSWORD=" + $temporalDbPassword)
$content = $content.Replace("TEMPORAL_DB_USER=temporal", "TEMPORAL_DB_USER=temporal")
$content = $content.Replace("TEMPORAL_DB_NAME=temporal", "TEMPORAL_DB_NAME=temporal")
$content = $content.Replace("TIKTOK_CLIENT_ID=replace-with-tiktok-client-id", "TIKTOK_CLIENT_ID=" + $TikTokClientId)
$content = $content.Replace("TIKTOK_CLIENT_SECRET=replace-with-tiktok-client-secret", "TIKTOK_CLIENT_SECRET=" + $TikTokClientSecret)
$content += "`nRUN_CRON=true`n"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($envPath, $content.Replace("`r`n", "`n"), $utf8NoBom)
New-Item -ItemType Directory -Force -Path $tmpEnvDir | Out-Null
[System.IO.File]::WriteAllText($tmpEnvPath, $content.Replace("`r`n", "`n"), $utf8NoBom)

$wslProductionDir = "/mnt/c/Users/roro9/postiz-app/deploy/production"
& wsl -e bash -lc "cd '$wslProductionDir' && chmod +x *.sh && ./start-local-live.sh"
if ($LASTEXITCODE -ne 0) {
  throw "Failed to start the local Postiz stack in WSL."
}

Wait-ForHttp200 -Url $publicUrl

Write-Host "Postiz is live."
Write-Host "Public URL: $publicUrl"
Write-Host "Cloudflare tunnel PID: $($tunnelProcess.Id)"