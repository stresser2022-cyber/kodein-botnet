CREATE TABLE IF NOT EXISTS attacks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    target VARCHAR(255) NOT NULL,
    port INTEGER,
    duration INTEGER NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    
    rate INTEGER,
    rqmethod VARCHAR(10),
    proxylist VARCHAR(10),
    headers TEXT,
    http_version INTEGER,
    protocol INTEGER,
    postdata TEXT,
    payload VARCHAR(255),
    range_subnet INTEGER,
    
    external_attack_id INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attacks_user_id ON attacks(user_id);
CREATE INDEX idx_attacks_status ON attacks(status);
CREATE INDEX idx_attacks_expires_at ON attacks(expires_at);