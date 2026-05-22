-- Step 1: Add nullable column
ALTER TABLE products ADD COLUMN supplier_id UUID;

-- Step 2: Insert 8 suppliers (2 per category)
INSERT INTO suppliers (id, name, contact_email, contact_phone, country, city, county, street_address)
VALUES
    -- Electronics suppliers
    ('5a77e001-0000-0000-0000-000000000001', 'TechPro Electronics', 'sales@techpro.com', '+1-555-0100',
     'USA', 'San Francisco', 'San Francisco County', '123 Tech Street'),
    ('5a77e002-0000-0000-0000-000000000002', 'Global Gadgets Ltd', 'info@globalgadgets.co.uk', '+44-20-7946-0958',
     'United Kingdom', 'London', 'Greater London', '45 Innovation Way'),

    -- Clothing suppliers
    ('5a77e003-0000-0000-0000-000000000003', 'Fashion First Textiles', 'contact@fashionfirst.it', '+39-02-1234-5678',
     'Italy', 'Milan', 'Milan', 'Via della Moda 12'),
    ('5a77e004-0000-0000-0000-000000000004', 'Urban Wear Co', 'sales@urbanwear.de', '+49-30-12345678',
     'Germany', 'Berlin', 'Berlin', 'Hauptstrasse 88'),

    -- Home & Garden suppliers
    ('5a77e005-0000-0000-0000-000000000005', 'HomeComfort Solutions', 'info@homecomfort.nl', '+31-20-123-4567',
     'Netherlands', 'Amsterdam', 'North Holland', 'Keizersgracht 100'),
    ('5a77e006-0000-0000-0000-000000000006', 'GreenLife Garden Supply', 'contact@greenlife.fr', '+33-1-23-45-67-89',
     'France', 'Paris', 'Île-de-France', '25 Rue du Jardin'),

    -- Sports suppliers
    ('5a77e007-0000-0000-0000-000000000007', 'ActiveLife Sports', 'sales@activelife.ca', '+1-416-555-0199',
     'Canada', 'Toronto', 'Ontario', '789 Sports Avenue'),
    ('5a77e008-0000-0000-0000-000000000008', 'FitGear International', 'info@fitgear.com.au', '+61-2-9876-5432',
     'Australia', 'Sydney', 'New South Wales', '56 Fitness Road');

-- Step 3: Backfill existing products with appropriate suppliers
-- This handles both existing mock data products and any future products
-- Electronics products (category_id = 'ca7e0001-0000-0000-0000-000000000001')
UPDATE products SET supplier_id = '5a77e001-0000-0000-0000-000000000001'
WHERE category_id = 'ca7e0001-0000-0000-0000-000000000001'
  AND id IN ('fade0001-0000-0000-0000-000000000001', 'fade0003-0000-0000-0000-000000000003');

UPDATE products SET supplier_id = '5a77e002-0000-0000-0000-000000000002'
WHERE category_id = 'ca7e0001-0000-0000-0000-000000000001'
  AND id = 'fade0002-0000-0000-0000-000000000002';

-- Clothing products (category_id = 'ca7e0002-0000-0000-0000-000000000002')
UPDATE products SET supplier_id = '5a77e003-0000-0000-0000-000000000003'
WHERE category_id = 'ca7e0002-0000-0000-0000-000000000002'
  AND id = 'fade0004-0000-0000-0000-000000000004';

UPDATE products SET supplier_id = '5a77e004-0000-0000-0000-000000000004'
WHERE category_id = 'ca7e0002-0000-0000-0000-000000000002'
  AND id = 'fade0005-0000-0000-0000-000000000005';

-- Home & Garden products (category_id = 'ca7e0003-0000-0000-0000-000000000003')
UPDATE products SET supplier_id = '5a77e005-0000-0000-0000-000000000005'
WHERE category_id = 'ca7e0003-0000-0000-0000-000000000003'
  AND id = 'fade0006-0000-0000-0000-000000000006';

UPDATE products SET supplier_id = '5a77e006-0000-0000-0000-000000000006'
WHERE category_id = 'ca7e0003-0000-0000-0000-000000000003'
  AND id = 'fade0007-0000-0000-0000-000000000007';

-- Sports products (category_id = 'ca7e0004-0000-0000-0000-000000000004')
UPDATE products SET supplier_id = '5a77e007-0000-0000-0000-000000000007'
WHERE category_id = 'ca7e0004-0000-0000-0000-000000000004'
  AND id IN ('fade0008-0000-0000-0000-000000000008', 'fade000a-0000-0000-0000-00000000000a');

UPDATE products SET supplier_id = '5a77e008-0000-0000-0000-000000000008'
WHERE category_id = 'ca7e0004-0000-0000-0000-000000000004'
  AND id = 'fade0009-0000-0000-0000-000000000009';

-- Fallback: assign any remaining products without supplier to first supplier (TechPro)
UPDATE products SET supplier_id = '5a77e001-0000-0000-0000-000000000001'
WHERE supplier_id IS NULL;

-- Step 4: Make required
ALTER TABLE products ALTER COLUMN supplier_id SET NOT NULL;

-- Step 5: Add constraint
ALTER TABLE products
ADD CONSTRAINT fk_products_supplier
FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
