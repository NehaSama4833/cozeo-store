'use client';

import React from 'react';
import { Target, TrendingUp, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const values = [
  {
    icon: Target,
    title: 'Discipline',
    description: 'Consistency beats intensity. Show up every day, regardless of how you feel.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Embrace the journey of continuous improvement. Your potential is limitless.',
  },
  {
    icon: Shield,
    title: 'Resilience',
    description: 'Rise after every fall. True strength is forged in adversity.',
  },
  {
    icon: Zap,
    title: 'Self Mastery',
    description: 'Control what you can control. Excellence through self-discipline.',
  },
];

export default function BrandValues() {
  return (
    <section className="py-20 md:py-32 bg-cozeo-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cozeo-blue/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Built On Values
          </h2>
          <p className="mt-4 text-cozeo-grey max-w-2xl mx-auto">
            CoZeo is more than clothing. It is a mindset. A commitment to becoming 
            the best version of yourself.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                'group p-6 md:p-8 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cozeo-blue/30 hover:bg-white/[0.04] transition-all duration-300 animate-fade-in',
                `stagger-${index + 1}`
              )}
            >
              <div className="w-12 h-12 rounded-lg bg-cozeo-blue/10 flex items-center justify-center mb-6 group-hover:bg-cozeo-blue/20 transition-colors">
                <value.icon className="w-6 h-6 text-cozeo-blue" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {value.title}
              </h3>
              <p className="text-cozeo-grey text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
