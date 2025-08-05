Write-Host "Starting all Mathiox microservices..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start the following services:" -ForegroundColor Yellow
Write-Host "- Wallet Microservice" -ForegroundColor Cyan
Write-Host "- Credit-Debit Microservice" -ForegroundColor Cyan
Write-Host "- Funds Transfer Microservice" -ForegroundColor Cyan
Write-Host "- Funds Received Microservice" -ForegroundColor Cyan
Write-Host "- Funds Transfer History Microservice" -ForegroundColor Cyan
Write-Host "- Product Team Microservice" -ForegroundColor Cyan
Write-Host "- Sponsor Team Microservice" -ForegroundColor Cyan
Write-Host "- User Account Microservice" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Red
Write-Host ""

try {
    npm run start
} catch {
    Write-Host "Error starting services: $_" -ForegroundColor Red
    Write-Host "Make sure you have run 'npm install' first" -ForegroundColor Yellow
} 