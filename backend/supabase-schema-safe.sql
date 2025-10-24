-- Supabase Database Schema for Medical Inventory System (Safe Version)
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    role VARCHAR(50) DEFAULT 'Staff' CHECK (role IN ('Administrator', 'Pharmacist', 'Inventory Manager', 'Staff', 'Viewer')),
    permissions JSONB DEFAULT '{}',
    notifications JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address JSONB NOT NULL,
    website TEXT,
    license_number VARCHAR(255) UNIQUE NOT NULL,
    gst_number VARCHAR(255) UNIQUE NOT NULL,
    payment_terms VARCHAR(50) DEFAULT 'Net 30' CHECK (payment_terms IN ('Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash on Delivery', 'Advance Payment')),
    rating INTEGER DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Prescription', 'Over-the-Counter', 'Controlled Substance', 'Medical Device', 'Supplies')),
    manufacturer VARCHAR(255) NOT NULL,
    batch_number VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL CHECK (unit IN ('tablets', 'capsules', 'ml', 'mg', 'units', 'vials', 'boxes', 'strips')),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    location VARCHAR(255) NOT NULL,
    minimum_stock_level INTEGER DEFAULT 10 CHECK (minimum_stock_level >= 0),
    maximum_stock_level INTEGER DEFAULT 1000 CHECK (maximum_stock_level >= 0),
    description TEXT,
    barcode VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Ordered', 'Shipped', 'Delivered', 'Cancelled')),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);

CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_supplier_id ON medicines(supplier_id);
CREATE INDEX IF NOT EXISTS idx_medicines_expiry_date ON medicines(expiry_date);
CREATE INDEX IF NOT EXISTS idx_medicines_quantity ON medicines(quantity);
CREATE INDEX IF NOT EXISTS idx_medicines_is_active ON medicines(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_medicines_updated_at ON medicines;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow all operations on medicines" ON medicines;
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;

-- Basic RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations - you should customize these based on your requirements
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Allow all operations on medicines" ON medicines FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
