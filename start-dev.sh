#!/bin/bash

echo "🚀 ApplyAce Dev Bootstrap Starting..."

# Step 1: Copy .env files
cp backend/backend.env backend/.env
cp frontend/local.env frontend/.env

# Step 2: Verify essential backend env vars
echo "✅ Checking required backend env vars..."
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "COHERE_API_KEY" "OPENAI_API_KEY")

for VAR in "${REQUIRED_VARS[@]}"; do
  VALUE=$(grep "^$VAR=" backend/.env | cut -d '=' -f2-)
  if [ -z "$VALUE" ]; then
    echo "❌ Missing env var: $VAR"
  else
    echo "✅ $VAR is set"
  fi
done

# Step 3: Start backend
echo "🟢 Starting backend..."
cd backend
npm run server &
BACKEND_PID=$!
cd ..

# Step 4: Start frontend
echo "🟢 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers running."
echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Test: http://localhost:3000 (frontend) and http://localhost:8000/api/analytics/usage (backend)"

# Optional test
read -p "Run analytics API test now? (y/n): " confirm
if [[ $confirm == "y" ]]; then
  curl http://localhost:8000/api/analytics/usage
fi
