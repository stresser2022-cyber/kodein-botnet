ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_concurrents INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_duration INTEGER DEFAULT 60;

UPDATE users SET plan = 'free' WHERE plan IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_plan_expires_at ON users(plan_expires_at);