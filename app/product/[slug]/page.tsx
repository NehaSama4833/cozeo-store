'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, ShoppingBag, Truck, Shield, Minus, Plus } from 'lucide-react';
import { getProductBySlug } from '@/lib/supabase/client';
import { useCart } from '@/lib/context/CartContext';
import { Product, SIZE_CHART } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    async function loadProduct() {
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedSize(data.sizes[0]);
        setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    toast.success('Added to cart!', {
      description: `${product.name} - Size ${selectedSize}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-white/5 rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-white/5 rounded-xl" />
              <div className="space-y-4">
                <div className="h-10 bg-white/5 rounded w-3/4" />
                <div className="h-6 bg-white/5 rounded w-1/4" />
                <div className="h-24 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-cozeo-grey mb-8">
            The product you are looking for does not exist.
          </p>
          <Link href="/shop">
            <Button className="bg-white text-cozeo-black hover:bg-cozeo-grey-light">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cozeo-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center text-cozeo-grey hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cozeo-grey-dark">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden transition-all',
                      selectedImage === index
                        ? 'ring-2 ring-white'
                        : 'ring-1 ring-white/20 hover:ring-white/50'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Title & Price */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-2xl md:text-3xl font-semibold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <span className="text-xl text-cozeo-grey line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-cozeo-grey leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-white mb-3">
                  Color: <span className="text-cozeo-grey">{selectedColor}</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        selectedColor === color
                          ? 'bg-white text-cozeo-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-white mb-3">
                Size: <span className="text-cozeo-grey">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-12 h-12 rounded-lg text-sm font-medium transition-all',
                      selectedSize === size
                        ? 'bg-white text-cozeo-black'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Chart */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-3">Size Guide (inches)</h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-cozeo-grey">Chest:</span>
                  <span className="text-white ml-2">{SIZE_CHART[selectedSize as keyof typeof SIZE_CHART]?.chest}</span>
                </div>
                <div>
                  <span className="text-cozeo-grey">Length:</span>
                  <span className="text-white ml-2">{SIZE_CHART[selectedSize as keyof typeof SIZE_CHART]?.length}</span>
                </div>
                <div>
                  <span className="text-cozeo-grey">Sleeve:</span>
                  <span className="text-white ml-2">{SIZE_CHART[selectedSize as keyof typeof SIZE_CHART]?.sleeve}</span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 space-y-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-white text-cozeo-black hover:bg-cozeo-grey-light font-semibold py-6"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 text-white hover:bg-white/5 font-semibold py-6"
                >
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                <Truck className="w-5 h-5 text-cozeo-blue mb-2" />
                <span className="text-xs text-cozeo-grey">All India Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                <Check className="w-5 h-5 text-cozeo-blue mb-2" />
                <span className="text-xs text-cozeo-grey">COD Available</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                <Shield className="w-5 h-5 text-cozeo-blue mb-2" />
                <span className="text-xs text-cozeo-grey">Premium Quality</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 text-cozeo-grey text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
