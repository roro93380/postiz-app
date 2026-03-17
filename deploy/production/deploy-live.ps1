param(
  [Parameter(Mandatory = $true)] [string]$ServerHost,
  [Parameter(Mandatory = $true)] [string]$ServerUser,
  [Parameter(Mandatory = $true)] [string]$Domain,
  [Parameter(Mandatory = $true)] [string]$AdminEmail,
  [Parameter(Mandatory = $true)] [string]$TikTokClientId,
  [Parameter(Mandatory = $true)] [string]$TikTokClientSecret,
  [string]$SshPort = "22",
  [string]$RemoteDir = "/opt/postiz-live"
)

$ErrorActionPreference = "Stop"

function Get-RandomSecret([int]$Length = 48) {
  $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-="
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $bytes = New-Object byte[] ($Length)
  $rng.GetBytes($bytes)
  $sb = New-Object System.Text.StringBuilder
  foreach ($b in $bytes) {
    [void]$sb.Append($chars[$b % $chars.Length])
  }
  return $sb.ToString()
}

function Require-Tool([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required tool not found: $Name"
  }
}

Require-Tool "ssh"
Require-Tool "scp"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path
$productionDir = (Resolve-Path (Join-Path $PSScriptRoot ".")).Path
$dynamicConfigDir = (Resolve-Path (Join-Path $PSScriptRoot "../../dynamicconfig")).Path
$templatePath = Join-Path $productionDir ".env.production.example"

if (-not (Test-Path $templatePath)) {
  throw "Template not found: $templatePath"
}

$tmpRoot = Join-Path $env:TEMP ("postiz-live-" + [guid]::NewGuid().ToString("N"))
$tmpDeploy = Join-Path $tmpRoot "production"
$tmpDyn = Join-Path $tmpDeploy "dynamicconfig"
New-Item -ItemType Directory -Force -Path $tmpDeploy | Out-Null
New-Item -ItemType Directory -Force -Path $tmpDyn | Out-Null

Copy-Item (Join-Path $productionDir "*") $tmpDeploy -Recurse -Force
Copy-Item (Join-Path $dynamicConfigDir "*") $tmpDyn -Recurse -Force

$jwtSecret = Get-RandomSecret 64
$postizDbPassword = Get-RandomSecret 48
$temporalDbPassword = Get-RandomSecret 48

$content = Get-Content $templatePath -Raw
$content = $content -replace "POSTIZ_DOMAIN=postiz.example.com", ("POSTIZ_DOMAIN=" + $Domain)
$content = $content -replace "POSTIZ_EMAIL=admin@example.com", ("POSTIZ_EMAIL=" + $AdminEmail)
$content = $content -replace "MAIN_URL=https://postiz.example.com", ("MAIN_URL=https://" + $Domain)
$content = $content -replace "FRONTEND_URL=https://postiz.example.com", ("FRONTEND_URL=https://" + $Domain)
$content = $content -replace "NEXT_PUBLIC_BACKEND_URL=https://postiz.example.com/api", ("NEXT_PUBLIC_BACKEND_URL=https://" + $Domain + "/api")
$content = $content -replace "JWT_SECRET=replace-with-a-long-random-secret", ("JWT_SECRET=" + $jwtSecret)
$content = $content -replace "POSTIZ_DB_PASSWORD=replace-with-db-password", ("POSTIZ_DB_PASSWORD=" + $postizDbPassword)
$content = $content -replace "DATABASE_URL=postgresql://postiz-user:replace-with-db-password@postiz-postgres:5432/postiz-prod", ("DATABASE_URL=postgresql://postiz-user:" + $postizDbPassword + "@postiz-postgres:5432/postiz-prod")
$content = $content -replace "TEMPORAL_DB_PASSWORD=replace-with-temporal-db-password", ("TEMPORAL_DB_PASSWORD=" + $temporalDbPassword)
$content = $content -replace "TIKTOK_CLIENT_ID=replace-with-tiktok-client-id", ("TIKTOK_CLIENT_ID=" + $TikTokClientId)
$content = $content -replace "TIKTOK_CLIENT_SECRET=replace-with-tiktok-client-secret", ("TIKTOK_CLIENT_SECRET=" + $TikTokClientSecret)

$envPath = Join-Path $tmpDeploy ".env.production"
Set-Content -Path $envPath -Value $content -NoNewline

$remote = "$ServerUser@$ServerHost"

ssh -p $SshPort $remote "mkdir -p $RemoteDir"
scp -P $SshPort -r "$tmpDeploy/*" "$remote`:$RemoteDir/"

$remoteCmd = @"
set -euo pipefail
cd $RemoteDir
chmod +x *.sh
./bootstrap-server.sh
./validate-env.sh
./start.sh
"@

ssh -p $SshPort $remote "bash -lc '$remoteCmd'"

Write-Host "Deployment completed."
Write-Host "Public URL: https://$Domain"

Remove-Item -Path $tmpRoot -Recurse -Force