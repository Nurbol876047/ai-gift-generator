#!/bin/bash

echo "🚀 Setting up Toy Event Platform with SQLite..."

# Check if .env.local exists, if not create it
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ .env.local created with SQLite configuration"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run Prisma migrations
echo "🗄️ Setting up SQLite database..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create admin user
echo "👤 Creating admin user..."
npm run create-admin

echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  http://localhost:3000"
echo ""
echo "Admin credentials:"
echo "  Email: admin@example.com"
echo "  Password: password123"





