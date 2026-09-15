CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGSERIAL PRIMARY KEY,
  admin_id BIGINT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS admin_sessions_token_hash_idx ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  code CHAR(9) NOT NULL UNIQUE CHECK (code ~ '^[0-9]{9}$'),
  full_name TEXT NOT NULL,
  passport_number TEXT,
  date_of_birth DATE,
  course_name TEXT NOT NULL,
  issue_date DATE,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS certificates_status_idx ON certificates(status);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS certificates_set_updated_at ON certificates;
CREATE TRIGGER certificates_set_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO certificates (code, full_name, passport_number, date_of_birth, course_name, issue_date, status)
VALUES ('603778716', 'Aida Badri', 'N974687', '1982-03-09', 'Formation en Data Science', NULL, 'valid')
ON CONFLICT (code) DO UPDATE SET full_name = EXCLUDED.full_name, passport_number = EXCLUDED.passport_number, date_of_birth = EXCLUDED.date_of_birth, course_name = EXCLUDED.course_name, issue_date = EXCLUDED.issue_date, status = EXCLUDED.status;
