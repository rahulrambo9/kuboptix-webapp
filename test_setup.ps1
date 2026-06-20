# test_setup.ps1 - Automated verification script for Kuboptix Phase 1 Setup

$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Starting Automated Phase 1 Infrastructure Test " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Start Docker Containers
Write-Host "[1/6] Spinning up PostgreSQL, Redis, and NATS containers..." -ForegroundColor Yellow
docker compose up -d

# 2. Wait for Postgres and Redis ports to accept connections
Write-Host "[2/6] Waiting for database ports to open..." -ForegroundColor Yellow
$postgresReady = $false
$redisReady = $false

for ($i = 1; $i -le 15; $i++) {
    if (!$postgresReady) {
        $pgConn = Test-NetConnection -ComputerName localhost -Port 5432 -WarningAction SilentlyContinue
        if ($pgConn.TcpTestSucceeded) {
            Write-Host "  -> PostgreSQL port 5432 is open!" -ForegroundColor Green
            $postgresReady = $true
        }
    }
    if (!$redisReady) {
        $redisConn = Test-NetConnection -ComputerName localhost -Port 7379 -WarningAction SilentlyContinue
        if ($redisConn.TcpTestSucceeded) {
            Write-Host "  -> Redis port 7379 is open!" -ForegroundColor Green
            $redisReady = $true
        }
    }

    if ($postgresReady -and $redisReady) {
        break
    }
    Start-Sleep -Seconds 1
}

if (!$postgresReady -or !$redisReady) {
    Write-Error "Infrastructure services failed to start in time. Aborting."
}

# 3. Start Go backend and Next.js Frontend in background
Write-Host "[3/6] Starting Go backend and Next.js Frontend in background..." -ForegroundColor Yellow
$backendProcess = Start-Process go -ArgumentList "run main.go" -WorkingDirectory "backend-go" -NoNewWindow -PassThru
$frontendProcess = Start-Process npm -ArgumentList "run dev" -NoNewWindow -PassThru

# 4. Wait for servers to start listening
Write-Host "[4/6] Waiting for servers to start listening on ports..." -ForegroundColor Yellow
$backendReady = $false
$frontendReady = $false

for ($i = 1; $i -le 15; $i++) {
    if (!$backendReady) {
        $backendConn = Test-NetConnection -ComputerName localhost -Port 8000 -WarningAction SilentlyContinue
        if ($backendConn.TcpTestSucceeded) {
            Write-Host "  -> Go Backend is online on port 8000!" -ForegroundColor Green
            $backendReady = $true
        }
    }
    if (!$frontendReady) {
        $frontendConn = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
        if ($frontendConn.TcpTestSucceeded) {
            Write-Host "  -> Next.js Frontend is online on port 3000!" -ForegroundColor Green
            $frontendReady = $true
        }
    }

    if ($backendReady -and $frontendReady) {
        break
    }
    Start-Sleep -Seconds 1
}

if (!$backendReady -or !$frontendReady) {
    Write-Host "  -> Server initialization failed. Stopping processes..." -ForegroundColor Red
    if ($backendProcess) { Stop-Process -Id $backendProcess.Id -Force }
    if ($frontendProcess) { Stop-Process -Id $frontendProcess.Id -Force }
    docker compose down
    Write-Error "Servers failed to respond in time. Aborting."
}

# 5. Perform HTTP verification requests
Write-Host "[5/6] Performing health and API validations..." -ForegroundColor Yellow
Start-Sleep -Seconds 1 # let backend connection pools settle

try {
    # Health endpoint check
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get
    Write-Host "  -> HTTP GET /api/health succeeded!" -ForegroundColor Green
    $pgColor = "Red"
    if ($health.postgres -eq "connected") { $pgColor = "Green" }
    $redisColor = "Red"
    if ($health.redis -eq "connected") { $redisColor = "Green" }

    Write-Host "     PostgreSQL connection: $($health.postgres)" -ForegroundColor $pgColor
    Write-Host "     Redis connection:      $($health.redis)" -ForegroundColor $redisColor

    # Pods cache endpoint check (miss first, since no pods are stored)
    $pods = Invoke-RestMethod -Uri "http://localhost:8000/api/pods" -Method Get
    Write-Host "  -> HTTP GET /api/pods succeeded (returned $($pods.Length) items)" -ForegroundColor Green

    if ($health.postgres -eq "connected" -and $health.redis -eq "connected") {
        Write-Host "`n[SUCCESS] All verification tests passed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n[WARNING] Health check succeeded but connection states are unhealthy." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  -> API verification failed: $_" -ForegroundColor Red
}

# 6. Keep services running and show endpoints
Write-Host "`n[6/6] Services are remaining online." -ForegroundColor Yellow
Write-Host "  -> Go backend is running in the background (PID: $($backendProcess.Id)) on port 8000." -ForegroundColor Green
Write-Host "  -> Next.js Frontend is running in the background (PID: $($frontendProcess.Id)) on port 3000." -ForegroundColor Green
Write-Host "  -> Docker containers are running in the background." -ForegroundColor Green
Write-Host "  -> Run .\cleanup.bat to stop and clean up everything." -ForegroundColor Cyan

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host " Relevant Endpoints for Testing:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  * Next.js Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host "  * Go Backend API Base:  http://localhost:8000" -ForegroundColor White
Write-Host "  * Health Check API:    http://localhost:8000/api/health" -ForegroundColor White
Write-Host "  * Namespaces API:      http://localhost:8000/api/namespaces" -ForegroundColor White
Write-Host "  * Pods API:            http://localhost:8000/api/pods" -ForegroundColor White
Write-Host "  * Deployments API:     http://localhost:8000/api/deployments" -ForegroundColor White
Write-Host "  * Nodes API:           http://localhost:8000/api/nodes" -ForegroundColor White
Write-Host "  * Services API:        http://localhost:8000/api/services" -ForegroundColor White

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host " Integration test run completed " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
