-- Create balance_history table to track all balance changes
CREATE TABLE IF NOT EXISTS balance_history (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_balance_history_username ON balance_history(username);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_balance_history_created_at ON balance_history(created_at DESC);