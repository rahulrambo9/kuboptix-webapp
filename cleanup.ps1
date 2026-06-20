# cleanup.ps1 - Automated shutdown and cleanup script for Kuboptix

$ErrorActionPreference = "Continue"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Starting Automated Service Cleanup        " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Check and stop Go backend running on port 8000
Write-Host "[1/3] Checking for running Go backend services..." -ForegroundColor Yellow
$connection = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($connection) {
    # Extract unique process IDs owning port 8000
    $pids = $connection | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $pids) {
        try {
            $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "  -> Found active Go backend (PID: $p, Name: $($proc.ProcessName)). Stopping it..." -ForegroundColor Yellow
                Stop-Process -Id $p -Force
                Write-Host "     -> Backend process stopped successfully." -ForegroundColor Green
            }
        }
        catch {
            Write-Host "     -> Could not stop process with PID $($p): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  -> Go backend is not running on port 8000." -ForegroundColor Gray
}

# 2. Check and stop Next.js frontend running on port 3000
Write-Host "[2/3] Checking for running Next.js frontend services..." -ForegroundColor Yellow
$frontendConnection = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendConnection) {
    $pids = $frontendConnection | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($p in $pids) {
        try {
            $proc = Get-Process -Id $p -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Host "  -> Found active Next.js frontend (PID: $p, Name: $($proc.ProcessName)). Stopping it..." -ForegroundColor Yellow
                Stop-Process -Id $p -Force
                Write-Host "     -> Frontend process stopped successfully." -ForegroundColor Green
            }
        }
        catch {
            Write-Host "     -> Could not stop process with PID $($p): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  -> Next.js frontend is not running on port 3000." -ForegroundColor Gray
}

# 3. Check and stop Docker containers
Write-Host "[3/3] Checking for active Kuboptix Docker containers..." -ForegroundColor Yellow
$activeContainers = docker ps --filter "name=kuboptix" --format "{{.Names}}"
$allContainers = docker ps -a --filter "name=kuboptix" --format "{{.Names}}"

if ($allContainers) {
    if ($activeContainers) {
        Write-Host "  -> Found running containers: $($activeContainers -join ', ')" -ForegroundColor Yellow
    } else {
        Write-Host "  -> Found stopped/leftover containers: $($allContainers -join ', ')" -ForegroundColor Yellow
    }
    Write-Host "  -> Stopping and removing Docker Compose services..." -ForegroundColor Yellow
    docker compose down
    Write-Host "     -> Docker containers and networks cleared." -ForegroundColor Green
} else {
    Write-Host "  -> No Kuboptix Docker containers found." -ForegroundColor Gray
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Service cleanup process completed           " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
