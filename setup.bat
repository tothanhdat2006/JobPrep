@echo off
setlocal enabledelayedexpansion
color 0A
cls

echo.
echo ============================================================
echo           JobPrep Setup - Automated Installation
echo ============================================================
echo.
echo This script will:
echo   1. Download and install Python 3.12.13 (if needed)
echo   2. Download and install Node.js v24.15.0 (if needed)
echo   3. Install backend dependencies
echo   4. Install frontend dependencies
echo   5. Ask for your Google AI Studio API key
echo   6. Configure environment variables
echo   7. Start both backend and frontend servers
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ============================================================
    echo                  Installing Python 3.12.13...
    echo ============================================================
    echo.
    echo Downloading Python 3.12.13 installer...
    
    REM Download Python installer
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://www.python.org/ftp/python/3.12.13/python-3.12.13-amd64.exe', 'python-installer.exe')}"
    
    if exist python-installer.exe (
        echo ✓ Python installer downloaded
        echo.
        echo Installing Python 3.12.13...
        echo Please follow the installer prompts. Make sure to check "Add Python to PATH"
        python-installer.exe /passive PrependPath=1
        del python-installer.exe
        echo ✓ Python installation complete
    ) else (
        echo ERROR: Failed to download Python installer
        echo Please download manually from: https://www.python.org/ftp/python/3.12.13/python-3.12.13-amd64.exe
        pause
        exit /b 1
    )
) else (
    echo ✓ Python found:
    python --version
)

echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ============================================================
    echo                  Installing Node.js v24.15.0...
    echo ============================================================
    echo.
    echo Downloading Node.js v24.15.0 installer...
    
    REM Download Node.js installer
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v24.15.0/node-v24.15.0-x64.msi', 'node-installer.msi')}"
    
    if exist node-installer.msi (
        echo ✓ Node.js installer downloaded
        echo.
        echo Installing Node.js v24.15.0...
        msiexec /i node-installer.msi /passive /norestart
        del node-installer.msi
        echo ✓ Node.js installation complete
        echo.
        echo Please restart this script after the installation completes
        pause
        exit /b 0
    ) else (
        echo ERROR: Failed to download Node.js installer
        echo Please download manually from: https://nodejs.org/dist/v24.15.0/node-v24.15.0-x64.msi
        pause
        exit /b 1
    )
) else (
    echo ✓ Node.js found:
    node --version
)

echo.
echo ============================================================
echo               Verifying Installations...
echo ============================================================
echo.

echo Python version:
python --version
echo.
echo Node.js version:
node --version
echo.
echo npm version:
npm --version
echo.

REM Get API Key
echo ============================================================
echo                    Google AI Studio API Key
echo ============================================================
echo.
echo Get your free API key from: https://ai.google.dev/
echo.
set /p GOOGLE_API_KEY="Enter your Google AI Studio API key: "

if "!GOOGLE_API_KEY!"=="" (
    echo ERROR: API key cannot be empty
    pause
    exit /b 1
)

echo.
echo ============================================================
echo                  Setting up Backend...
echo ============================================================
echo.

REM Create backend .env file
cd backend
if exist .env (
    echo Backing up existing .env file...
    move .env .env.backup >nul
)

(
    echo # Google Gemini API Key
    echo GOOGLE_API_KEY=!GOOGLE_API_KEY!
    echo.
    echo # Database configuration
    echo DATABASE_URL=sqlite:///./jobprep.db
    echo.
    echo # Frontend URL for CORS
    echo FRONTEND_URL=http://localhost:5173
) > .env

echo ✓ Backend .env file created

REM Create Python virtual environment
echo.
echo Creating Python virtual environment...
if not exist .venv (
    python -m venv .venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

REM Activate virtual environment and install dependencies
echo.
echo Installing Python dependencies...
call .venv\Scripts\activate.bat
pip install --upgrade pip >nul 2>&1
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed

cd ..

echo.
echo ============================================================
echo                  Setting up Frontend...
echo ============================================================
echo.

REM Create frontend .env file
cd frontend
if exist .env (
    echo Backing up existing .env file...
    move .env .env.backup >nul
)

(
    echo # Backend API URL
    echo VITE_API_URL=http://localhost:8000
) > .env

echo ✓ Frontend .env file created

REM Install npm dependencies
echo.
echo Installing Node.js dependencies...
echo This may take a few minutes...
call npm install -q
if errorlevel 1 (
    echo ERROR: Failed to install npm dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed

cd ..

echo.
echo ============================================================
echo           Setup Complete! Starting servers...
echo ============================================================
echo.
echo Backend will start at:  http://localhost:8000
echo Frontend will start at: http://localhost:5173
echo.
echo Press any key to start both servers...
echo (You can stop them by pressing Ctrl+C in each terminal)
echo.
pause

REM Start backend in a new terminal
echo Starting Backend Server...
start cmd /k "cd backend && .venv\Scripts\activate.bat && python main.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new terminal
echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   Both servers are starting in separate terminals!
echo ============================================================
echo.
pause
