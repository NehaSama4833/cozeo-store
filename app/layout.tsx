import Script from "next/script"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CoZeo | Premium Streetwear for Gen Z',
  description: 'Where Comfort, Meets Class. Identity driven mindset streetwear for Gen Z aged 18 to 26 focused on discipline, growth, emotional strength and self mastery.',
  keywords: ['streetwear', 'hoodies', 'premium clothing', 'Gen Z fashion', 'Indian streetwear', 'CoZeo'],
  authors: [{ name: 'CoZeo' }],
  creator: 'CoZeo',
  publisher: 'CoZeo',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://cozeo.in',
    siteName: 'CoZeo',
    title: 'CoZeo | Premium Streetwear for Gen Z',
    description: 'Where Comfort, Meets Class. Identity driven mindset streetwear for Gen Z.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CoZeo - Premium Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CoZeo | Premium Streetwear for Gen Z',
    description: 'Where Comfort, Meets Class. Identity driven mindset streetwear for Gen Z.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://cozeo.in',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>

      <body className={`${inter.className} antialiased`}>

        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />

          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              },
            }}
          />

        </CartProvider>

      </body>
    </html>
  );
}