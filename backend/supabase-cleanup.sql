-- Cleanup script for Supabase Medical Inventory System
-- Run this first to clean up any existing schema, then run the main schema

-- Drop existing triggers first (only if tables exist)
DO $$ 
BEGIN
    -- Drop triggers only if the tables exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suppliers') THEN
        DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medicines') THEN
        DROP TRIGGER IF EXISTS update_medicines_updated_at ON medicines;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    END IF;
END $$;

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop any existing policies (only if tables exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        DROP POLICY IF EXISTS "Allow all operations on users" ON users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suppliers') THEN
        DROP POLICY IF EXISTS "Allow all operations on suppliers" ON suppliers;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'medicines') THEN
        DROP POLICY IF EXISTS "Allow all operations on medicines" ON medicines;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
    END IF;
END $$;

-- Now run the main schema after this cleanup
