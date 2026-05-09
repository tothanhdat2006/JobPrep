#!/bin/bash

set -e

SCRIPTROOT="$(cd "$(dirname "$0")" && pwd)"

clear
echo "============================================================"
echo "           JobPrep Setup - Automated Installation"
echo "============================================================"
echo ""
echo "This script will:"
echo "  1. Download and install Python 3.13.13 (if needed)"
echo "  2. Download and install Node.js v24.15.0 using nvm (if needed)"
echo "  3. Install backend dependencies"
echo "  4. Install frontend dependencies"
echo "  5. Ask for your Google AI Studio API key"
echo "  6. Configure environment variables"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "============================================================"
    echo "               Installing Python 3.13.13..."
    echo "============================================================"
    echo ""
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || { echo "ERROR: Homebrew installation failed"; exit 1; }
        fi
        echo "Installing Python 3.13.13 via Homebrew..."
        brew install python@3.13 || { echo "ERROR: brew install python@3.13 failed"; exit 1; }
        ln -sf /usr/local/opt/python@3.13/bin/python3.13 /usr/local/bin/python3 || { echo "ERROR: Failed to link python3"; exit 1; }
    else
        # Linux
        echo "Installing dependencies..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update || { echo "ERROR: apt-get update failed"; exit 1; }
            sudo apt-get install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget libgl1-mesa-glx libgles2-mesa libxkbcommon0 || { echo "ERROR: apt-get install failed"; exit 1; }
        elif command -v yum &> /dev/null; then
            sudo yum groupinstall -y "Development Tools" || { echo "ERROR: yum groupinstall failed"; exit 1; }
            sudo yum install -y zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel gcc make libffi-devel mesa-libGL-devel mesa-libGLES-devel libxkbcommon-devel || { echo "ERROR: yum install failed"; exit 1; }
        fi
        
        echo "Downloading Python 3.13.13..."
        cd /tmp || exit 1
        wget https://www.python.org/ftp/python/3.13.13/Python-3.13.13.tar.xz || { echo "ERROR: wget failed"; exit 1; }
        tar -xf Python-3.13.13.tar.xz || { echo "ERROR: tar extraction failed"; exit 1; }
        cd Python-3.13.13 || exit 1
        
        echo "Building and installing Python..."
        ./configure --prefix=$HOME/.local || { echo "ERROR: configure failed"; exit 1; }
        make || { echo "ERROR: make failed"; exit 1; }
        make install || { echo "ERROR: make install failed"; exit 1; }
        
        export PATH=$HOME/.local/bin:$PATH
        echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
        
        rm -rf /tmp/Python-3.13.13 /tmp/Python-3.13.13.tar.xz
        cd - > /dev/null || exit 1
    fi
    
    echo "✓ Python installation complete"
    python3 --version
else
    echo "✓ Python found:"
    python3 --version
fi

echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "============================================================"
    echo "               Installing Node.js v24.15.0..."
    echo "============================================================"
    echo ""
    
    # Check if nvm is installed
    if [ -z "$NVM_DIR" ]; then
        NVM_DIR="$HOME/.nvm"
    fi
    
    if [ ! -d "$NVM_DIR" ]; then
        echo "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash || { echo "ERROR: nvm installation failed"; exit 1; }
    fi
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || { echo "ERROR: Failed to load nvm"; exit 1; }
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    echo "Installing Node.js v24..."
    nvm install 24 || { echo "ERROR: nvm install 24 failed"; exit 1; }
    nvm use 24 || { echo "ERROR: nvm use 24 failed"; exit 1; }
    
    echo "✓ Node.js installation complete"
    node -v
    npm -v
else
    echo "✓ Node.js found:"
    node --version
fi

echo ""
echo "============================================================"
echo "           Installing Backend & Frontend Dependencies"
echo "============================================================"
echo ""

echo "Installing backend Python dependencies..."
python3 -m pip install --upgrade pip || { echo "WARNING: pip upgrade failed"; }
if [ -f "$SCRIPTROOT/backend/requirements.txt" ]; then
    python3 -m pip install -r "$SCRIPTROOT/backend/requirements.txt" || { echo "ERROR: backend requirements install failed"; exit 1; }
else
    echo "WARNING: backend/requirements.txt not found"
fi

echo "✓ Backend dependencies installed"
echo ""

echo "Installing optional kivy for GUI..."
python3 -m pip install kivy || { echo "WARNING: kivy installation failed. Console UI will be used instead."; }

echo ""
echo "Installing frontend Node.js dependencies..."
cd "$SCRIPTROOT/frontend" || exit 1
if [ -f "package.json" ]; then
    npm install || { echo "ERROR: npm install failed"; exit 1; }
else
    echo "WARNING: frontend/package.json not found"
fi
cd "$SCRIPTROOT" || exit 1
echo "✓ Frontend dependencies installed"
echo ""
echo "============================================================"
echo "               Verifying Installations..."
echo "============================================================"
echo ""
echo "Python version:"
python3 --version
echo ""
echo "Node.js version:"
node -v
echo ""
echo "npm version:"
npm -v
echo ""

echo ""
echo "Launching setup UI..."
echo "The UI will let you paste your API key, create .env files, and start servers."
echo ""

python3 "$SCRIPTROOT/tools/setup_ui.py"
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: Python setup UI exited with error code $?"
    echo "The console fallback UI should have been shown above."
    echo "If no UI appeared, check the error messages above."
    echo ""
fi
echo ""
echo "Setup UI finished."
