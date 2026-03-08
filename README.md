# CoZeo - Premium Streetwear E-commerce

A production-ready full-stack ecommerce website for CoZeo, an Indian premium streetwear brand focused on discipline, growth, emotional strength and self-mastery.

## Features

- **Home Page** - Strong hero section with brand positioning
- **Shop Page** - Product listing with grid layout
- **Product Detail Page** - Size selection, color options, quantity controls
- **Cart** - Global state management with localStorage persistence
- **Checkout** - Address form with payment method selection (Razorpay & COD)
- **Order Confirmation** - Detailed order summary with tracking timeline
- **Admin Dashboard** - Product and order management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Payments**: Razorpay (UPI, Cards, Net Banking) + Cash on Delivery
- **UI Components**: shadcn/ui

## Brand Colors

- Black: `#0A0A0A`
- White: `#FFFFFF`
- Deep Blue: `#1E3A5F`
- Muted Grey: `#8B8B8B`

## Getting Started

### 1. Clone and Install

```bash
cd cozeo
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key ID (public)

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `lib/supabase/schema.sql` in the SQL Editor
3. This will create the products and orders tables with sample data

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles
├── shop/                       # Shop page
├── product/[slug]/             # Product detail page
├── cart/                       # Cart page
├── checkout/                   # Checkout page
├── order-confirmation/         # Order confirmation page
├── admin/                      # Admin dashboard
└── api/
    └── razorpay/
        ├── create-order/       # Create order API
        └── verify-payment/     # Verify payment API

components/
├── Navbar.tsx                  # Navigation bar
├── Footer.tsx                  # Footer
├── ui/                         # shadcn/ui components
└── sections/                   # Page sections
    ├── Hero.tsx
    ├── FeaturedProducts.tsx
    ├── BrandValues.tsx
    └── Quality.tsx

lib/
├── types/                      # TypeScript types
├── supabase/                   # Supabase client & schema
├── context/                    # React contexts
└── utils.ts                    # Utility functions

public/
└── images/                     # Product images
```

## Payment Methods

### Razorpay (Online Payments)
- UPI
- Credit/Debit Cards
- Net Banking
- Wallets

### Cash on Delivery (COD)
- Manual order processing
- Payment status: pending
- Verification required

## Order Flow

1. User adds products to cart
2. User proceeds to checkout
3. User fills shipping address
4. User selects payment method
5. Order is created in database
6. 
   - For Razorpay: Payment modal opens → Payment verification → Order confirmation
   - For COD: Direct order confirmation

## Admin Features

- View all products
- View all orders
- Delete products
- Order status tracking

## Important Notes

- **No Returns/Refunds**: As per business policy
- **India Shipping Only**: All orders shipped within India
- **Free Shipping**: On all orders
- **COD Available**: Cash on delivery option

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the project:
```bash
npm run build
```

The `dist` folder will contain the static export (if configured) or use `next start` for server deployment.

## License

Private - All rights reserved by CoZeo.
