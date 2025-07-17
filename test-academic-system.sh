#!/bin/bash

# Script untuk testing sistem akademik
echo "🔧 Testing Academic Scoring System..."

# Check if environment variables are set
echo "📋 Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
    echo "💡 Please create .env.local file with your Supabase credentials"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
    echo "💡 Please create .env.local file with your Supabase credentials"
    exit 1
fi

echo "✅ Environment variables are set"

# Check if schema has been applied
echo "📊 Checking database schema..."
echo "💡 Make sure you have run the SQL schema in your Supabase dashboard:"
echo "   - supabase-academic-scoring-schema.sql"

echo "🚀 Starting development server..."
pnpm dev
