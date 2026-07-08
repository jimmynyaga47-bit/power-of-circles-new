CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50) DEFAULT 'mpesa',
  mpesa_reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS check_ins (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id),
  scanned_by INTEGER REFERENCES users(id),
  scanned_at TIMESTAMP DEFAULT NOW(),
  is_valid BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS hero_section (
  id SERIAL PRIMARY KEY,
  heading VARCHAR(200),
  subheading VARCHAR(200),
  description TEXT,
  bg_image_url VARCHAR(255),
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS founders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100),
  bio TEXT,
  photo_url VARCHAR(255),
  social_links JSONB,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(255),
  website VARCHAR(255),
  tier VARCHAR(50),
  event_id INTEGER REFERENCES events(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'image',
  caption TEXT,
  event_id INTEGER REFERENCES events(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id),
  type VARCHAR(50),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent'
);

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
('maintenance_mode', 'false'),
('site_title', 'Power of Circles in Networking Africa'),
('site_logo', ''),
('site_favicon', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO roles (name) VALUES
('Super Admin'),
('Admin'),
('Ticket Officer'),
('Content Manager'),
('Finance')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS ticket_types (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Additive migrations (safe: do not touch or drop existing data)
-- Adds ticket category support (Paid, Complimentary, VIP
-- Invitation, Staff, Media, Speaker), QR code storage, and an
-- updated_at column used by ticket upgrade/downgrade.
-- ============================================================

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category VARCHAR(30) DEFAULT 'paid';
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS qr_code TEXT;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

UPDATE tickets SET category = 'paid' WHERE category IS NULL;