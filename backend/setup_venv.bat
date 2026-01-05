@echo off
echo Setting up Python environment with uv...

echo Installing uv if not already installed...
pip install uv

echo Creating virtual environment with uv...
uv venv

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing dependencies with uv...
uv pip install -r requirements.txt

echo Setup complete!
echo Virtual environment created in .venv directory
echo To activate the environment, run: .venv\Scripts\activate.bat
pause
