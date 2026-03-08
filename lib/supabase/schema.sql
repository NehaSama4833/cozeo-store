-- CoZeo E-commerce Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  images TEXT[] DEFAULT '{}',
  sizes VARCHAR(10)[] DEFAULT '{"S","M","L","XL","XXL"}',
  colors VARCHAR(50)[] DEFAULT '{"Black"}',
  category VARCHAR(100) DEFAULT 'hoodies',
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 100,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on products"
  ON products FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for orders (authenticated access)
CREATE POLICY "Allow authenticated read access on orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample products with local images
INSERT INTO products (name, slug, description, price, original_price, images, sizes, colors, category, tags, featured, stock_quantity) VALUES
(
  'Discipline Hoodie',
  'discipline-hoodie',
  'Premium heavyweight cotton hoodie featuring our signature Discipline print. Designed for those who choose consistency over motivation. 400 GSM French terry fabric with reinforced stitching.',
  1299,
  1599,
  ARRAY['/images/hoodie-discipline.jpg'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Navy'],
  'hoodies',
  ARRAY['discipline', 'mindset', 'premium'],
  true,
  50
),
(
  'Growth Mindset Hoodie',
  'growth-mindset-hoodie',
  'Embrace the journey of continuous improvement. This hoodie represents the belief that abilities can be developed through dedication and hard work. Premium comfort for everyday warriors.',
  1199,
  1499,
  ARRAY['/images/hoodie-growth.jpg'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Charcoal'],
  'hoodies',
  ARRAY['growth', 'mindset', 'motivation'],
  true,
  45
),
(
  'Resilience Hoodie',
  'resilience-hoodie',
  'Built for those who rise after every fall. The Resilience hoodie is a reminder that strength is forged in adversity. Heavyweight construction meets minimalist design.',
  1299,
  1599,
  ARRAY['/images/hoodie-resilience.jpg'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Deep Blue'],
  'hoodies',
  ARRAY['resilience', 'strength', 'premium'],
  true,
  40
),
(
  'Self Mastery Hoodie',
  'self-mastery-hoodie',
  'Control what you can control. The Self Mastery hoodie embodies the pursuit of excellence through self-discipline. For the ones who show up every single day.',
  1199,
  1399,
  ARRAY['/images/hoodie-mastery.jpg'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'Grey'],
  'hoodies',
  ARRAY['mastery', 'discipline', 'focus'],
  false,
  35
),
(
  'Focus Hoodie',
  'focus-hoodie',
  'Eliminate distractions. Lock in. The Focus hoodie is designed for deep work sessions and meaningful pursuits. Clean aesthetic meets uncompromising comfort.',
  799,
  999,
  ARRAY['/images/hoodie-focus.jpg'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black'],
  'hoodies',
  ARRAY['focus', 'minimal', 'essential'],
  true,
  60
)
ON CONFLICT (slug) DO NOTHING;
