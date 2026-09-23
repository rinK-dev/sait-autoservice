CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(
    120
) NOT NULL,
    email VARCHAR(
    255
) UNIQUE NOT NULL,
    password_hash TEXT,
    role VARCHAR(
    20
) NOT NULL CHECK(
    role IN (
    'manager','mechanic','client'
)
),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitations(
    id SERIAL PRIMARY KEY,
    email VARCHAR(
    255
) NOT NULL,
    name VARCHAR(
    120
) NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE TABLE cars(
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(
    id
),
    brand VARCHAR(
    80
),
    model VARCHAR(
    80
),
    plate_number VARCHAR(
    30
),
    year INTEGER,
    mileage INTEGER,
    vin VARCHAR(
    80
)
);

CREATE TABLE service_records(
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(
    id
) ON DELETE CASCADE,
    mechanic_id INTEGER REFERENCES users(
    id
),
    service_date DATE NOT NULL,
    mileage INTEGER,
    title VARCHAR(
    200
) NOT NULL,
    parts TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Первый зарегистрированный пользователь получает manager на сервере.
