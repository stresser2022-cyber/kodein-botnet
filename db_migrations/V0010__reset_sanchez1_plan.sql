-- Reset plan for sanchez1 user
UPDATE users SET plan = 'free', plan_expires_at = NULL WHERE username = 'sanchez1';