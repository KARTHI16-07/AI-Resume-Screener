CREATE TABLE IF NOT EXISTS "user" (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS job (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_job_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS candidate (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    resume_file_name VARCHAR(255),
    resume_file_path VARCHAR(1024),
    resume_content_type VARCHAR(255),
    extracted_text TEXT,
    job_id BIGINT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_candidate_job FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS score_result (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL UNIQUE,
    score DOUBLE PRECISION,
    matched_terms TEXT,
    missing_terms TEXT,
    explanation TEXT,
    scored_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_score_candidate FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_job_user_id ON job(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_job_id ON candidate(job_id);
