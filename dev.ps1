$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm run dev
    exit $LASTEXITCODE
}

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "Node.js not found in PATH." -ForegroundColor Red
    Write-Host "Install LTS from https://nodejs.org/ with Add to PATH, then restart the terminal." -ForegroundColor Yellow
    Write-Host "Or use Cursor integrated terminal where node is usually available." -ForegroundColor Yellow
    exit 1
}

$nextCli = Join-Path $PSScriptRoot 'node_modules\next\dist\bin\next'
if (-not (Test-Path $nextCli)) {
    Write-Host "Next.js CLI missing. Run: npm install" -ForegroundColor Red
    exit 1
}

Write-Host "npm not in PATH; starting via: $($nodeCmd.Source)" -ForegroundColor DarkGray
& $nodeCmd.Source $nextCli dev
