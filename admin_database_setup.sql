-- ApnaFreelancer Admin Database Schema
-- Complete SQL commands to create all tables with admin functionality

-- 1. Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- 2. Users table with admin functionality
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR, -- For custom authentication
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    bio TEXT,
    skills TEXT[],
    hourly_rate DECIMAL(10,2),
    is_freelancer BOOLEAN DEFAULT false,
    is_client BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false, -- Admin role
    status VARCHAR DEFAULT 'pending', -- pending, approved, rejected, suspended
    rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    location VARCHAR,
    availability VARCHAR DEFAULT 'available',
    approved_by VARCHAR REFERENCES users(id), -- Admin who approved
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Services table with approval workflow
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    freelancer_id VARCHAR REFERENCES users(id) NOT NULL,
    category_id INTEGER REFERENCES categories(id) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    delivery_time INTEGER NOT NULL, -- in days
    images TEXT[],
    skills TEXT[],
    status VARCHAR DEFAULT 'pending', -- pending, approved, rejected
    is_active BOOLEAN DEFAULT false, -- Only active after approval
    approved_by VARCHAR REFERENCES users(id), -- Admin who approved
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Jobs table with approval workflow
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR REFERENCES users(id) NOT NULL,
    category_id INTEGER REFERENCES categories(id) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    experience_level VARCHAR(20) NOT NULL,
    skills TEXT[],
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, open, closed
    approved_by VARCHAR REFERENCES users(id), -- Admin who approved
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Proposals table
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) NOT NULL,
    freelancer_id VARCHAR REFERENCES users(id) NOT NULL,
    cover_letter TEXT NOT NULL,
    proposed_price DECIMAL(10,2) NOT NULL,
    delivery_time INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR REFERENCES users(id) NOT NULL,
    receiver_id VARCHAR REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Hire Requests table (NEW - for hire talent requests)
CREATE TABLE IF NOT EXISTS hire_requests (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR REFERENCES users(id) NOT NULL,
    freelancer_id VARCHAR REFERENCES users(id) NOT NULL,
    project_title VARCHAR(200) NOT NULL,
    project_description TEXT NOT NULL,
    budget DECIMAL(10,2),
    deadline TIMESTAMP,
    status VARCHAR DEFAULT 'pending', -- pending, approved, rejected, completed
    client_message TEXT,
    admin_response TEXT,
    approved_by VARCHAR REFERENCES users(id), -- Admin who approved
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Admin Actions Log table (NEW - for tracking admin activities)
CREATE TABLE IF NOT EXISTS admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR REFERENCES users(id) NOT NULL,
    action VARCHAR NOT NULL, -- approve_user, reject_user, approve_service, etc.
    target_type VARCHAR NOT NULL, -- user, service, job, hire_request
    target_id VARCHAR NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Reviews table with hire request support
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id VARCHAR REFERENCES users(id) NOT NULL,
    reviewee_id VARCHAR REFERENCES users(id) NOT NULL,
    job_id INTEGER REFERENCES jobs(id),
    service_id INTEGER REFERENCES services(id),
    hire_request_id INTEGER REFERENCES hire_requests(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (you should change the password)
INSERT INTO users (
    email, 
    password, 
    first_name, 
    last_name, 
    is_admin, 
    is_client, 
    is_freelancer, 
    status
) VALUES (
    'admin@apnafreelancer.com',
    '$2a$12$LQv3c1yqBwWrD8bJC8bfM.n7aGfZeN9Q1W3D4K5P7R8S9T0U1V2W3X', -- password: 'admin123' (change this!)
    'Admin',
    'User',
    true,
    true,
    true,
    'approved'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, icon) VALUES 
('Web Development', 'Frontend, backend, and full-stack web development', '💻'),
('Mobile Development', 'iOS, Android, and cross-platform mobile apps', '📱'),
('Design & Creative', 'UI/UX, graphic design, branding, and creative work', '🎨'),
('Digital Marketing', 'SEO, social media, content marketing, and advertising', '📈'),
('Writing & Content', 'Copywriting, technical writing, and content creation', '✍️'),
('Data & Analytics', 'Data science, analytics, and business intelligence', '📊')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_freelancer ON services(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_client ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_hire_requests_status ON hire_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_type, target_id);

-- Admin specific views for easier querying
CREATE OR REPLACE VIEW admin_pending_users AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_freelancer,
    u.is_client,
    u.created_at,
    u.bio,
    u.skills,
    u.location
FROM users u 
WHERE u.status = 'pending' AND u.is_admin = false
ORDER BY u.created_at DESC;

CREATE OR REPLACE VIEW admin_pending_services AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.price,
    s.delivery_time,
    s.skills,
    s.created_at,
    u.first_name || ' ' || u.last_name as freelancer_name,
    u.email as freelancer_email,
    c.name as category_name
FROM services s
JOIN users u ON s.freelancer_id = u.id
JOIN categories c ON s.category_id = c.id
WHERE s.status = 'pending'
ORDER BY s.created_at DESC;

CREATE OR REPLACE VIEW admin_pending_hire_requests AS
SELECT 
    hr.id,
    hr.project_title,
    hr.project_description,
    hr.budget,
    hr.deadline,
    hr.client_message,
    hr.created_at,
    c.first_name || ' ' || c.last_name as client_name,
    c.email as client_email,
    f.first_name || ' ' || f.last_name as freelancer_name,
    f.email as freelancer_email
FROM hire_requests hr
JOIN users c ON hr.client_id = c.id
JOIN users f ON hr.freelancer_id = f.id
WHERE hr.status = 'pending'
ORDER BY hr.created_at DESC;

COMMENT ON TABLE users IS 'Users table with admin approval workflow';
COMMENT ON TABLE services IS 'Services that require admin approval before being public';
COMMENT ON TABLE jobs IS 'Job postings that require admin approval';
COMMENT ON TABLE hire_requests IS 'Direct hire requests between clients and freelancers';
COMMENT ON TABLE admin_actions IS 'Log of all admin actions for audit trail';