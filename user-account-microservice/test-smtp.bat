@echo off
echo.
echo ========================================
echo    SMTP Configuration Test
echo ========================================
echo.
echo This will test your SMTP email configuration.
echo Make sure you have set up your .env file first!
echo.
pause

echo.
echo Running SMTP test...
echo.

npx ts-node test/smtp-test.ts

echo.
echo ========================================
echo Test completed!
echo ========================================
echo.
pause 