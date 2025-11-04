# SmartFinance AI Backend Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting SmartFinance AI Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

