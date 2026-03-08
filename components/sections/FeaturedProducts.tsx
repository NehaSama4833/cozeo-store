'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getFeaturedProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-cozeo-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-lg" />
                <div className="mt-4 h-4 bg-white/5 rounded w-3/4" />
                <div className="mt-2 h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-cozeo-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Featured Collection
            </h2>
            <p className="mt-4 text-cozeo-grey max-w-lg">
              Our most loved pieces. Premium hoodies designed for those who choose 
              discipline over motivation.
            </p>
          </div>
          <Link href="/shop" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 group"
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className={cn(
                'group block animate-fade-in',
                `stagger-${index + 1}`
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cozeo-grey-dark">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick View */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold">
                    Quick View
                  </Button>
                </div>

                {/* Badge */}
                {product.original_price && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-cozeo-blue text-white text-xs font-semibold rounded">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="text-white font-medium group-hover:text-cozeo-grey transition-colors">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-white font-semibold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.original_price && (
                    <span className="text-cozeo-grey line-through text-sm">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
