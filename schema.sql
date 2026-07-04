-- Kayombo Core Builders Company (KCBC Ltd) Database Schema

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table (Leads/Contact)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    details TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read-only access for projects
CREATE POLICY "Allow public read access for projects" 
ON projects FOR SELECT 
USING (true);

-- Public insert-only access for messages
CREATE POLICY "Allow public insert for messages" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access for projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access for messages" 
ON messages FOR ALL 
USING (auth.role() = 'authenticated');