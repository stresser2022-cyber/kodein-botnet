-- Create user_balances table to store user balance information
CREATE TABLE IF NOT EXISTS user_balances (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_user_balances_username ON user_balances(username);