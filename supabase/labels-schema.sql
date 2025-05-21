-- Create the labels table for storing global behavioral/emotional state labels
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default labels
INSERT INTO labels (name) VALUES
  ('happy'),
  ('sad'),
  ('angry'),
  ('tantrum'),
  ('sleeping');

-- Set up Row Level Security (RLS) for the labels table
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view labels (global access)
CREATE POLICY "Anyone can view labels" ON labels
  FOR SELECT
  USING (true);

-- Create policy to allow all authenticated users to insert labels (global access)
CREATE POLICY "Anyone can insert labels" ON labels
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow all authenticated users to delete labels (global access)
CREATE POLICY "Anyone can delete labels" ON labels
  FOR DELETE
  USING (true);

-- Update the logs table to reference the labels table
-- Note: We're not adding a foreign key constraint to allow keeping deleted labels
-- This is per the requirement that deleting a label should not affect logs
