CREATE TABLE suppliers
(
    id             UUID         PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    contact_email  VARCHAR(255),
    contact_phone  VARCHAR(50),
    country        VARCHAR(100),
    city           VARCHAR(100),
    county         VARCHAR(100),
    street_address VARCHAR(255)
);
