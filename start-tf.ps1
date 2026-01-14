# Team Forge Startup Script

Write-Host "🔥 Team Forge: Initializing Sequence..." -ForegroundColor Cyan

# 1. Run Validation Tests
Write-Host "🧪 Running Automated Tests..." -ForegroundColor Yellow
$testResult = Invoke-Expression ".\nx.bat run-many -t test --all --parallel=3"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests Failed! Aborting startup." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tests Passed." -ForegroundColor Green

# 2. Start Backend (API Gateway)
Write-Host "🚀 Starting API Gateway (Port 3000)..." -ForegroundColor Magenta
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\nx.bat serve api-gateway"

# 3. Start Plugin (Team Manager)
Write-Host "🧩 Starting Team Manager Plugin (Port 4202)..." -ForegroundColor Magenta
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\nx.bat serve team_manager"

# 4. Start Plugin (User Admin)
Write-Host "👤 Starting User Admin Plugin (Port 4201)..." -ForegroundColor Magenta
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\nx.bat serve user_admin"

# 4. Start Shell (Frontend Host)
Write-Host "💻 Starting Frontend Shell (Port 4200)..." -ForegroundColor Magenta
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", ".\nx.bat serve shell"

Write-Host "✨ System is live!" -ForegroundColor Cyan
Write-Host "   -> API: http://localhost:3000/api"
Write-Host "   -> App: http://localhost:4200"
