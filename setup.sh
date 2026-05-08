#!/bin/bash

set -e

clear
echo "============================================================"
echo "           JobPrep Setup - Automated Installation"
echo "============================================================"
echo ""
echo "This script will:"
echo "  1. Download and install Python 3.12.13 (if needed)"
echo "  2. Download and install Node.js v24.15.0 using nvm (if needed)"
echo "  3. Install backend dependencies"
echo "  4. Install frontend dependencies"
echo "  5. Ask for your Google AI Studio API key"
echo "  6. Configure environment variables"
echo "  7. Start both backend and frontend servers"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "============================================================"
    echo "               Installing Python 3.12.13..."
    echo "============================================================"
    echo ""
    
    # Determine OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        echo "Installing Python 3.12.13 via Homebrew..."
        brew install python@3.12
        ln -sf /usr/local/opt/python@3.12/bin/python3.12 /usr/local/bin/python3
    else
        # Linux
        echo "Installing dependencies..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget
        elif command -v yum &> /dev/null; then
            sudo yum groupinstall -y "Development Tools"
            sudo yum install -y zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make libffi-devel
        fi
        
        echo "Downloading Python 3.12.13..."
        cd /tmp
        wget https://www.python.org/ftp/python/3.12.13/Python-3.12.13.tar.xz
        tar -xf Python-3.12.13.tar.xz
        cd Python-3.12.13
        
        echo "Building and installing Python..."
        ./configure --prefix=$HOME/.local
        make
        make install
        
        export PATH=$HOME/.local/bin:$PATH
        echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
        
        rm -rf /tmp/Python-3.12.13 /tmp/Python-3.12.13.tar.xz
        cd - > /dev/null
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
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    fi
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    echo "Installing Node.js v24..."
    nvm install 24
    nvm use 24
    
    echo "✓ Node.js installation complete"
    node -v
    npm -v
else
    echo "✓ Node.js found:"
    node --version
fi

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

# Get API Key
echo "============================================================"
echo "                    Google AI Studio API Key"
echo "============================================================"
echo ""
echo "Get your free API key from: https://ai.google.dev/"
echo ""
read -p "Enter your Google AI Studio API key: " GOOGLE_API_KEY

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "ERROR: API key cannot be empty"
    exit 1
fi

echo ""
echo "============================================================"
echo "                  Setting up Backend..."
echo "============================================================"
echo ""

# Create backend .env file
cd backend
if [ -f .env ]; then
    echo "Backing up existing .env file..."
    mv .env .env.backup
fi

cat > .env << EOF
# Google Gemini API Key
GOOGLE_API_KEY=$GOOGLE_API_KEY

# Database configuration
DATABASE_URL=sqlite:///./jobprep.db

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
EOF

echo "✓ Backend .env file created"

# Create Python virtual environment
echo ""
echo "Creating Python virtual environment..."
if [ ! -d .venv ]; then
    python3 -m venv .venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo ""
echo "Installing Python dependencies..."
source .venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -q -r requirements.txt
echo "✓ Python dependencies installed"

cd ..

echo ""
echo "============================================================"
echo "                  Setting up Frontend..."
echo "============================================================"
echo ""

# Create frontend .env file
cd frontend
if [ -f .env ]; then
    echo "Backing up existing .env file..."
    mv .env .env.backup
fi

cat > .env << EOF
# Backend API URL
VITE_API_URL=http://localhost:8000
EOF

echo "✓ Frontend .env file created"

# Install npm dependencies
echo ""
echo "Installing Node.js dependencies..."
echo "This may take a few minutes..."
npm install -q
echo "✓ Node.js dependencies installed"

cd ..

echo ""
echo "============================================================"
echo "           Setup Complete! Starting servers..."
echo "============================================================"
echo ""
echo "Backend will start at:  http://localhost:8000"
echo "Frontend will start at: http://localhost:5173"
echo ""
echo "Press Enter to start both servers..."
echo "(You can stop them by pressing Ctrl+C)"
echo ""
read

# Load nvm if needed
if [ -z "$(command -v node)" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Start backend in background
echo "Starting Backend Server..."
cd backend
source .venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in foreground
echo "Starting Frontend Server..."
cd frontend
npm run dev
cd ..

# Wait for backend to finish
wait $BACKEND_PID
