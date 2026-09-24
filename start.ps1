Write-Host "🚀 Starting AI Resume Screener Full Stack..." -ForegroundColor Green

# 1. Start Python Scoring Service
Write-Host "Starting Python Scoring Service (Port 8001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd scoring-service; python -m uvicorn main:app --port 8001`""

# 2. Start Spring Boot Backend
Write-Host "Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; mvn spring-boot:run`""

# 3. Start React Frontend
Write-Host "Starting React Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "✅ All services are spinning up in separate windows!" -ForegroundColor Green
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API:  http://localhost:8080" -ForegroundColor Yellow
Write-Host "Scoring API:  http://localhost:8001" -ForegroundColor Yellow
