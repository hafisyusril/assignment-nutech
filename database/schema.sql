CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE transaction_type_enum AS ENUM ('TOPUP', 'PAYMENT');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  profile_image TEXT,
  balance BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code VARCHAR(50) UNIQUE NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_icon TEXT,
  service_tariff BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_name VARCHAR(100) NOT NULL,
  banner_image TEXT NOT NULL,
  description TEXT
);


CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  service_id UUID,
  transaction_type transaction_type_enum NOT NULL,
  description TEXT,
  top_up_amount BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES users(id),

  CONSTRAINT fk_service
    FOREIGN KEY (service_id) REFERENCES services(id)
);