Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SMTP Configuration Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will test your SMTP email configuration." -ForegroundColor Yellow
Write-Host "Make sure you have set up your .env file first!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "Running SMTP test..." -ForegroundColor Green
Write-Host ""

npx ts-node test/smtp-test.ts

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit" 