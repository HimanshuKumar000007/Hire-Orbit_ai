-- Run this in your Supabase SQL Editor:
-- Dashboard: https://supabase.com/dashboard/project/buqkdtnffjoiwwtfxiek/sql/new

-- Add analysis_data column to profiles table to persist AI analysis results
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS analysis_data JSONB DEFAULT NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
