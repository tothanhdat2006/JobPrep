@echo off
setlocal enabledelayedexpansion

@REM ============================================================
@REM CONFIGURATION
@REM ============================================================
set "SCRIPTROOT=%~dp0"

set "PYTHON_DIR=%SCRIPTROOT%python"
set "PYTHON_VER=3.13.13"
set "PYTHON_ZIP=python-%PYTHON_VER%-embed-amd64.zip"
set "PYTHON_URL=https://www.python.org/ftp/python/%PYTHON_VER%/%PYTHON_ZIP%"
set "PIP_URL=https://bootstrap.pypa.io/get-pip.py"

set "PYTHON_BIN=%PYTHON_DIR%\python.exe"
set "PYTHON_PTH=%PYTHON_DIR%\python313._pth"

@REM ============================================================
@REM 1. CHECK & INSTALL PYTHON
@REM ============================================================
echo [1/5] Checking Python environment...

if exist "%PYTHON_BIN%" (
    echo - Python found in %PYTHON_DIR%. Skipping download.
) else (
    echo - Python missing or incomplete. Starting download...

    @REM Clean up partial downloads from previous failed runs
    if exist "%PYTHON_ZIP%" (
        echo - Found leftover %PYTHON_ZIP%. Deleting to ensure fresh download...
        del "%PYTHON_ZIP%"
    )

    echo - Downloading Python %PYTHON_VER% Embeddable...
    echo.
    powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%PYTHON_URL%', '%PYTHON_ZIP%')"
    echo.
    if !errorlevel! neq 0 goto :ERROR_NETWORK

    echo - Extracting to %PYTHON_DIR%...
    powershell -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%PYTHON_ZIP%' -DestinationPath '%PYTHON_DIR%' -Force"
    if !errorlevel! neq 0 goto :ERROR_EXTRACT

    echo - Cleaning up zip file...
    del "%PYTHON_ZIP%"
)

@REM Double check that extraction actually worked
if not exist "%PYTHON_BIN%" goto :ERROR_EXTRACT

@REM ============================================================
@REM 2. CONFIGURE ._pth FILE
@REM ============================================================
echo [2/5] Configuring %PYTHON_PTH%...
@REM This is safe to run repeatedly; it simply replaces the string if found.
powershell -ExecutionPolicy Bypass -Command "(Get-Content '%PYTHON_PTH%') -replace '#import site', 'import site' | Set-Content '%PYTHON_PTH%'"

@REM ============================================================
@REM 3. INSTALL PIP
@REM ============================================================
echo [3/5] Checking for pip...

if exist "%PYTHON_DIR%\Scripts\pip.exe" (
    echo - pip found. Skipping.
) else (
    echo - pip not found.

    @REM Clean up partial get-pip.py
    if exist "get-pip.py" del "get-pip.py"

    echo - Downloading get-pip.py...
    echo.
    powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%PIP_URL%', 'get-pip.py')"
    echo.
    if !errorlevel! neq 0 goto :ERROR_NETWORK

    echo - Installing pip...
    "%PYTHON_BIN%" get-pip.py --no-warn-script-location
    if !errorlevel! neq 0 goto :ERROR_PIP

    del "get-pip.py"
)

@REM ============================================================
@REM 4. INSTALL BACKEND REQUIREMENTS
@REM ============================================================
echo [4/5] Installing backend dependencies...
if exist "%SCRIPTROOT%backend\requirements.txt" (
    "%PYTHON_BIN%" -m pip install -r "%SCRIPTROOT%backend\requirements.txt" --no-warn-script-location
    if !errorlevel! neq 0 (
        echo ERROR: pip install failed with exit code !errorlevel!
        goto :ERROR_PIP
    )
) else (
    echo.
    echo FATAL: Cannot find backend\requirements.txt
    pause
    exit /b 1
)

echo.
echo [4.5/5] Installing optional kivy for GUI...
"%PYTHON_BIN%" -m pip install kivy
if !errorlevel! neq 0 (
    echo WARNING: kivy installation failed. Console UI will be used instead.
)

echo.

@REM ============================================================
@REM 5. CHECK NODE.JS & SETUP ENVIRONMENTS
@REM ============================================================
echo [5/5] Checking Node.js environment...

if exist "%SystemRoot%\System32\node.exe" (
    echo - Node.js found in system. Skipping download.
) else (
    node --version >nul 2>&1
    if errorlevel 1 (
        echo - Node.js not found. Downloading installer...
        echo.
        
        set "NODE_INSTALLER=node-v24.15.0-x64.msi"
        powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v24.15.0/%NODE_INSTALLER%', '%NODE_INSTALLER%')"
        
        if !errorlevel! neq 0 goto :ERROR_NETWORK
        
        echo - Installing Node.js...
        msiexec /i "%NODE_INSTALLER%" /passive /norestart
        if !errorlevel! neq 0 goto :ERROR_NODEJS
        
        del "%NODE_INSTALLER%"
        echo - Node.js installation complete
    )
)


@REM Launching graphical setup UI for API key and environment setup
echo.
echo ============================================================
echo                  Setup Configuration UI
echo ============================================================
echo.
echo Launching graphical interface...
echo The UI will let you paste your API key, create .env files, and start servers.
echo.

"%PYTHON_BIN%" "%SCRIPTROOT%tools\setup_ui.py"
if %errorlevel% neq 0 (
    echo.
    echo WARNING: Python setup UI exited with error code %errorlevel%
    echo The console fallback UI should have been shown above.
    echo If no UI appeared, check the error messages above.
    echo.
)

echo.
echo Setup UI finished. Exiting installer.
echo.
pause
exit /b 0

@REM ============================================================
@REM ERROR HANDLERS
@REM ============================================================
:ERROR_NETWORK
echo.
echo FATAL: Network request failed.
echo Please check your internet connection and try again.
echo.
pause
exit /b 1

:ERROR_EXTRACT
echo.
echo FATAL: Failed to extract Python.
echo The downloaded zip might be corrupt.
echo The script will delete it automatically on the next run.
echo.
pause
exit /b 1

:ERROR_PIP
echo.
echo FATAL: Pip installation or package install failed.
echo.
pause
exit /b 1

:ERROR_NODEJS
echo.
echo FATAL: Node.js installation failed.
echo Please download and install manually from: https://nodejs.org/
echo.
pause
exit /b 1

:ERROR_NPM
echo.
echo FATAL: npm dependencies installation failed.
echo.
pause
exit /b 1
