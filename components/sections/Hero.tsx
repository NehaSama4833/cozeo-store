'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cozeo-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cozeo-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cozeo-blue/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cozeo-blue" />
            <span className="text-sm text-cozeo-grey">Premium Streetwear for Gen Z</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 animate-fade-in stagger-1">
            Where Comfort
            <br />
            <span className="text-gradient">Meets Class</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-cozeo-grey max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            Identity driven mindset streetwear. Built for discipline, growth, 
            emotional strength and self-mastery. Not trend based fashion.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold px-8 py-6 text-base group"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-6 text-base"
              >
                View Hoodies
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in stagger-4">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">400</div>
              <div className="text-xs md:text-sm text-cozeo-grey mt-1">GSM Fabric</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">5</div>
              <div className="text-xs md:text-sm text-cozeo-grey mt-1">Premium Hoodies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">₹799</div>
              <div className="text-xs md:text-sm text-cozeo-grey mt-1">Starting Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
}
