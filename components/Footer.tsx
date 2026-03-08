'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cozeo-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-white">
                Co<span className="text-cozeo-blue">Zeo</span>
              </span>
            </Link>

            <p className="mt-4 text-cozeo-grey text-sm max-w-sm">
              Identity driven mindset streetwear for Gen Z. Where Comfort, Meets Class. 
              Built for discipline, growth, and self-mastery.
            </p>

            <div className="flex items-center space-x-4 mt-6">

              <a
                href="https://www.instagram.com/cozeowear.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cozeo-grey hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="mailto:cozeo.enterprise@gmail.com"
                className="text-cozeo-grey hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">

              <li>
                <Link
                  href="/"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Support
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-cozeo-grey text-sm">
                  Shipping: All India
                </span>
              </li>

              <li>
                <span className="text-cozeo-grey text-sm">
                  COD Available
                </span>
              </li>

              <li>
                <span className="text-cozeo-grey text-sm">
                  No Returns / Refunds
                </span>
              </li>

              <li>
                <a
                  href="mailto:cozeo.enterprise@gmail.com"
                  className="text-cozeo-grey hover:text-white text-sm transition-colors"
                >
                  cozeo.enterprise@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-cozeo-grey text-xs">
            © {currentYear} CoZeo. All rights reserved.
          </p>

          <p className="text-cozeo-grey text-xs mt-2 md:mt-0">
            Made with discipline in India
          </p>
        </div>
      </div>
    </footer>
  );
}