-- Create the logs table for storing emotional/behavioral states
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  label TEXT NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Set up Row Level Security (RLS) to ensure users can only access their own data
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own logs
CREATE POLICY "Users can insert their own logs" ON logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select their own logs
CREATE POLICY "Users can view their own logs" ON logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own logs
CREATE POLICY "Users can update their own logs" ON logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own logs
CREATE POLICY "Users can delete their own logs" ON logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX logs_user_id_idx ON logs (user_id);

-- Create an index on timestamp for sorting and filtering
CREATE INDEX logs_timestamp_idx ON logs (timestamp);
