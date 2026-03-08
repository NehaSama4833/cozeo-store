'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  '400 GSM Heavyweight French Terry',
  '100% Premium Cotton',
  'Reinforced Double Stitching',
  'Pre-shrunk Fabric',
  'Oversized Fit',
  'Ribbed Cuffs & Hem',
];

export default function Quality() {
  return (
    <section className="py-20 md:py-32 bg-cozeo-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
                alt="CoZeo Premium Quality"
                fill
                className="object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cozeo-black/40 via-transparent to-transparent" />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 p-6 bg-cozeo-blue rounded-xl shadow-glow">
              <div className="text-3xl md:text-4xl font-bold text-white">400</div>
              <div className="text-white/80 text-sm">GSM Fabric</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-cozeo-blue text-sm font-semibold uppercase tracking-wider">
              Premium Quality
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Crafted for
              <br />
              <span className="text-gradient">Excellence</span>
            </h2>
            <p className="mt-6 text-cozeo-grey text-lg leading-relaxed">
              Every CoZeo hoodie is crafted with meticulous attention to detail. 
              We use only the finest materials to ensure comfort, durability, and style 
              that lasts.
            </p>

            {/* Features List */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className={cn(
                    'flex items-center space-x-3 animate-fade-in',
                    `stagger-${index + 1}`
                  )}
                >
                  <div className="w-5 h-5 rounded-full bg-cozeo-blue/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-cozeo-blue" />
                  </div>
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
