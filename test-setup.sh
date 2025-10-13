#!/bin/bash

# Medical Inventory System Setup Test Script

echo "🏥 Medical Inventory System - Setup Test"
echo "========================================"

# Check if Node.js is installed
echo "📦 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
echo "📦 Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm is installed: $NPM_VERSION"
else
    echo "❌ npm is not installed."
    exit 1
fi

# Check if MongoDB is running (optional)
echo "🗄️ Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️ MongoDB is not running. Please start MongoDB or use MongoDB Atlas."
    fi
else
    echo "⚠️ MongoDB client not found. Please install MongoDB or use MongoDB Atlas."
fi

# Check frontend dependencies
echo "🔍 Checking frontend dependencies..."
if [ -f "package.json" ]; then
    echo "✅ Frontend package.json found"
    
    # Check if Clerk is installed
    if npm list @clerk/clerk-react &> /dev/null; then
        echo "✅ Clerk React package is installed"
    else
        echo "❌ Clerk React package is not installed. Run: npm install @clerk/clerk-react"
    fi
else
    echo "❌ Frontend package.json not found"
fi

# Check backend dependencies
echo "🔍 Checking backend dependencies..."
if [ -f "backend/package.json" ]; then
    echo "✅ Backend package.json found"
    
    # Check if Clerk SDK is installed
    if [ -d "backend/node_modules/@clerk" ]; then
        echo "✅ Clerk SDK is installed"
    else
        echo "❌ Clerk SDK is not installed. Run: cd backend && npm install"
    fi
else
    echo "❌ Backend package.json not found"
fi

# Check environment files
echo "🔧 Checking environment configuration..."

if [ -f ".env.local" ]; then
    echo "✅ Frontend .env.local found"
    if grep -q "REACT_APP_CLERK_PUBLISHABLE_KEY" .env.local; then
        echo "✅ Clerk publishable key is configured"
    else
        echo "⚠️ Clerk publishable key not found in .env.local"
    fi
else
    echo "⚠️ Frontend .env.local not found. Please create it with your Clerk keys."
fi

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env found"
    if grep -q "CLERK_SECRET_KEY" backend/.env; then
        echo "✅ Clerk secret key is configured"
    else
        echo "⚠️ Clerk secret key not found in backend/.env"
    fi
    
    if grep -q "MONGODB_URI" backend/.env; then
        echo "✅ MongoDB URI is configured"
    else
        echo "⚠️ MongoDB URI not found in backend/.env"
    fi
else
    echo "⚠️ Backend .env not found. Please create it with your configuration."
fi

echo ""
echo "🎯 Setup Summary:"
echo "=================="
echo "1. Install dependencies: npm run install:all"
echo "2. Configure Clerk keys in .env files"
echo "3. Start MongoDB (if using local instance)"
echo "4. Run development servers: npm run dev"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo "🔗 Clerk Dashboard: https://dashboard.clerk.com"
echo ""

# Test if we can start the servers (optional)
read -p "🚀 Would you like to test starting the servers? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting development servers..."
    echo "Frontend will be available at: http://localhost:3000"
    echo "Backend will be available at: http://localhost:5000"
    echo "Press Ctrl+C to stop both servers"
    npm run dev
fi
