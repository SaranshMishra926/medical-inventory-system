@echo off
echo 🏥 Medical Inventory System - Setup Test
echo ========================================

echo 📦 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js is installed: %%i
) else (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo 📦 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm is installed: %%i
) else (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo 🔍 Checking frontend dependencies...
if exist "package.json" (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json not found
)

echo 🔍 Checking backend dependencies...
if exist "backend\package.json" (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json not found
)

echo 🔧 Checking environment configuration...
if exist ".env.local" (
    echo ✅ Frontend .env.local found
) else (
    echo ⚠️ Frontend .env.local not found. Please create it with your Clerk keys.
)

if exist "backend\.env" (
    echo ✅ Backend .env found
) else (
    echo ⚠️ Backend .env not found. Please create it with your configuration.
)

echo.
echo 🎯 Setup Summary:
echo ==================
echo 1. Install dependencies: npm run install:all
echo 2. Configure Clerk keys in .env files
echo 3. Start MongoDB (if using local instance)
echo 4. Run development servers: npm run dev
echo.
echo 📚 For detailed setup instructions, see README.md
echo 🔗 Clerk Dashboard: https://dashboard.clerk.com
echo.

set /p choice="🚀 Would you like to test starting the servers? (y/n): "
if /i "%choice%"=="y" (
    echo Starting development servers...
    echo Frontend will be available at: http://localhost:3000
    echo Backend will be available at: http://localhost:5000
    echo Press Ctrl+C to stop both servers
    npm run dev
)

pause
