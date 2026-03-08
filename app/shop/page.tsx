'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-white/5 rounded w-1/4 mb-4" />
            <div className="h-6 bg-white/5 rounded w-1/3 mb-12" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/5 rounded-lg" />
                <div className="mt-4 h-4 bg-white/5 rounded w-3/4" />
                <div className="mt-2 h-4 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Shop Collection
          </h1>
          <p className="mt-4 text-cozeo-grey max-w-xl">
            Premium unisex hoodies designed for discipline, growth, and self-mastery. 
            Sizes S to XXL available.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className={cn(
                'group block animate-fade-in',
                `stagger-${(index % 5) + 1}`
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cozeo-grey-dark">
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
                    View Product
                  </Button>
                </div>

                {/* Badge */}
                {product.original_price && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-cozeo-blue text-white text-xs font-semibold rounded">
                    Sale
                  </div>
                )}
                {product.featured && !product.original_price && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur text-white text-xs font-semibold rounded">
                    Featured
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-5">
                <h3 className="text-lg font-medium text-white group-hover:text-cozeo-grey transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-cozeo-grey text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <span className="text-white font-semibold text-lg">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.original_price && (
                    <span className="text-cozeo-grey line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-cozeo-grey">
                    Sizes: {product.sizes.join(', ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-cozeo-grey text-lg">
              No products available at the moment.
            </p>
            <p className="text-cozeo-grey mt-2">
              Check back soon for new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
