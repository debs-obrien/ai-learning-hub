-- SQL to create tables in Supabase
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN ('blog', 'video', 'podcast', 'course', 'paper', 'other')),
  status TEXT NOT NULL DEFAULT 'to_learn' CHECK (status IN ('to_learn', 'learning', 'completed')),
  priority INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  favicon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Content Ideas table
CREATE TABLE IF NOT EXISTS content_ideas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'blog_post' CHECK (type IN ('blog_post', 'video', 'tutorial', 'thread', 'other')),
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'drafting', 'published')),
  linked_resource_ids TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - optional but recommended
-- For now, we'll allow all operations (you can add policies later for user-specific access)

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since you're using app-level auth)
-- These policies allow anyone with a valid Supabase key to access the data

CREATE POLICY "Allow all operations on resources" ON resources
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on content_ideas" ON content_ideas
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_priority ON resources(priority);
CREATE INDEX IF NOT EXISTS idx_content_ideas_status ON content_ideas(status);
