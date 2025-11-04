@echo off
echo ========================================
echo Starting SmartFinance AI - Full Stack
echo ========================================
echo.

echo Starting Backend in new window...
start "SmartFinance Backend" cmd /k call start-backend.bat

timeout /t 3 /nobreak >nul

echo Starting Frontend in new window...
start "SmartFinance Frontend" cmd /k call start-frontend.bat

echo.
echo ========================================
echo SmartFinance AI is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================

