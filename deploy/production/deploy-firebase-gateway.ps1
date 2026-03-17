param(
  [Parameter(Mandatory = $true)] [string]$FirebaseProjectId,
  [Parameter(Mandatory = $true)] [string]$Domain
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  throw "Firebase CLI is required but was not found in PATH."
}

$tmpRoot = Join-Path $env:TEMP ("postiz-firebase-gateway-" + [guid]::NewGuid().ToString("N"))
$publicDir = Join-Path $tmpRoot "public"
New-Item -ItemType Directory -Force -Path $publicDir | Out-Null

$indexHtml = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=https://$Domain" />
    <title>Redirecting to Postiz</title>
  </head>
  <body>
    Redirecting to <a href="https://$Domain">https://$Domain</a>
  </body>
</html>
"@

Set-Content -Path (Join-Path $publicDir "index.html") -Value $indexHtml -NoNewline

$firebaseJson = @"
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "redirects": [
      {
        "source": "**",
        "destination": "https://$Domain",
        "type": 302
      }
    ]
  }
}
"@

Set-Content -Path (Join-Path $tmpRoot "firebase.json") -Value $firebaseJson -NoNewline

Push-Location $tmpRoot
try {
  firebase deploy --project $FirebaseProjectId --only hosting
}
finally {
  Pop-Location
  Remove-Item -Path $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Firebase gateway deployed."
Write-Host "Public URL: https://$FirebaseProjectId.web.app"