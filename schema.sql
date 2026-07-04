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

-- Admin Settings (For simple password check)
CREATE TABLE admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Insert default admin password
INSERT INTO admin_settings (key, value) VALUES ('admin_password', 'KAYOMBO123%');

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read-only access for projects
CREATE POLICY "Allow public read access for projects" 
ON projects FOR SELECT 
USING (true);

-- Public insert-only access for messages
CREATE POLICY "Allow public insert for messages" 
ON messages FOR INSERT 
WITH CHECK (true);

-- Public read access for admin password (to check during login)
-- Note: In a production app, use Supabase Auth instead.
CREATE POLICY "Allow public read for settings"
ON admin_settings FOR SELECT
USING (true);

-- Authenticated (Admin) full access
CREATE POLICY "Allow authenticated full access for projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access for messages" 
ON messages FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access for settings"
ON admin_settings FOR ALL
USING (auth.role() = 'authenticated');
