#!/bin/bash

# Break Tracking Backend Setup Script
# This script automates the setup process for the backend application

echo "🚀 Break Tracking Backend Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start MongoDB with: brew services start mongodb-community (macOS)"
        echo "   or: sudo systemctl start mongod (Ubuntu)"
    fi
else
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "   Install MongoDB: brew install mongodb-community (macOS)"
    echo "   or: sudo apt-get install mongodb (Ubuntu)"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Setting up environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        echo "📝 Creating .env file from template..."
        cp env.example .env
        echo "✅ .env file created"
        echo ""
        echo "⚠️  IMPORTANT: Please edit .env file with your configuration:"
        echo "   - Set MONGODB_URI to your MongoDB connection string"
        echo "   - Set JWT_SECRET to a secure random string"
        echo "   - Adjust other settings as needed"
        echo ""
        echo "   Example:"
        echo "   MONGODB_URI=mongodb://localhost:27017/break-tracking"
        echo "   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
        echo ""
    else
        echo "❌ env.example file not found"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Setup complete! Next steps:"
echo ""
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB if not already running"
echo "3. Start the server:"
echo "   - Development: npm run dev"
echo "   - Production: npm start"
echo ""
echo "4. Test the API:"
echo "   - Health check: http://localhost:5000/health"
echo "   - API base: http://localhost:5000/api"
echo ""
echo "5. Import postman_collection.json to Postman for testing"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🎉"
