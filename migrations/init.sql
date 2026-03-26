-- enable pgvector (run as superuser if needed)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (id serial primary key, email text unique, password_hash text, role text);
CREATE TABLE jobs (id serial primary key, title text, description_text text, company text, owner_id int, created_at timestamptz default now());
CREATE TABLE resumes (id serial primary key, user_id int, filename text, text text, created_at timestamptz default now());

-- embeddings table for pgvector
CREATE TABLE embeddings (id serial primary key, source_type text, source_id text UNIQUE, vector vector(768), updated_at timestamptz default now());

-- optional index for ivfflat (requires setting vector type properly and pgvector installed)
CREATE INDEX IF NOT EXISTS embeddings_vector_idx ON embeddings USING ivfflat (vector) WITH (lists = 100);

CREATE TABLE matches (id serial primary key, job_id int, resume_id int, score numeric, matched_at timestamptz default now());
