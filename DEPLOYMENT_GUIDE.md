# CoZeo E-commerce - Deployment Guide

## Project Overview

Complete full-stack ecommerce website for CoZeo - Premium Indian Streetwear Brand.

## Features Implemented

### Frontend
- **Home Page** - Hero section, Featured Products, Brand Values, Quality Section
- **Shop Page** - Product grid with filtering
- **Product Detail Page** - Size selection, color options, quantity controls, size chart
- **Cart Page** - Item management with quantity controls
- **Checkout Page** - Address form, payment method selection
- **Order Confirmation** - Order summary with tracking timeline
- **Admin Dashboard** - Product and order management

### Backend
- **Razorpay Integration** - Online payments (UPI, Cards, Net Banking)
- **Cash on Delivery** - Manual order processing
- **Supabase Database** - Products and orders storage

### Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase
- Razorpay
- shadcn/ui components

## Project Structure

```
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── shop/                       # Shop page
├── product/[slug]/             # Product detail page
├── cart/                       # Cart page
├── checkout/                   # Checkout page
├── order-confirmation/         # Order confirmation
├── admin/                      # Admin dashboard
└── api/razorpay/               # API routes

components/
├── Navbar.tsx
├── Footer.tsx
├── ui/                         # shadcn/ui components
└── sections/                   # Page sections

lib/
├── types/                      # TypeScript types
├── supabase/                   # Supabase client
├── context/CartContext.tsx     # Cart state management
└── utils.ts

public/images/                  # Product images
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd cozeo
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the schema from `lib/supabase/schema.sql`
4. This creates:
   - `products` table with 5 sample hoodies
   - `orders` table for order storage
   - Row Level Security policies
   - Indexes for performance

### 4. Razorpay Setup

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from Dashboard → Settings → API Keys
3. Add them to your `.env.local` file

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 6. Build for Production

```bash
npm run build
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 2: Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

### Option 3: Self-Hosted

```bash
npm run build
npm start
```

## Brand Configuration

### Colors
- Black: `#0A0A0A`
- White: `#FFFFFF`
- Deep Blue: `#1E3A5F`
- Muted Grey: `#8B8B8B`

### Products
5 unisex hoodies:
1. Discipline Hoodie - ₹1,299
2. Growth Mindset Hoodie - ₹1,199
3. Resilience Hoodie - ₹1,299
4. Self Mastery Hoodie - ₹1,199
5. Focus Hoodie - ₹799

Sizes: S, M, L, XL, XXL

### Business Rules
- India shipping only
- Cash on Delivery available
- No returns or refunds
- Free shipping on all orders

## Admin Access

Navigate to `/admin` to access the dashboard.

Features:
- View all products
- View all orders
- Delete products
- Track order status

## API Endpoints

### Create Order
```
POST /api/razorpay/create-order
```

### Verify Payment
```
POST /api/razorpay/verify-payment
```

## Important Notes

1. **Environment Variables**: Make sure all required env vars are set
2. **Database**: Run the schema SQL before first use
3. **Razorpay**: Use test keys for development, live keys for production
4. **Images**: Product images are in `/public/images/`
5. **SEO**: Meta tags are configured in `app/layout.tsx`

## Troubleshooting

### Build Errors
- Check Node.js version (18+ recommended)
- Clear `.next` folder and rebuild
- Verify all dependencies are installed

### Database Errors
- Verify Supabase credentials
- Check RLS policies are configured
- Ensure tables are created

### Payment Errors
- Verify Razorpay keys
- Check webhook configuration
- Review payment logs in Razorpay dashboard

## Support

For issues or questions:
- Email: support@cozeo.in
- Documentation: See README.md
