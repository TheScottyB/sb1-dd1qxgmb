import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Product type definition
export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: string;
  currency: string;
  mode: 'subscription' | 'payment';
  interval: string | null;
  metadata: Record<string, string>;
  images: string[];
}

// Define a type for the categories we use
export type ProductCategory = 'subscription' | 'donation' | 'all';

/**
 * Hook to fetch and manage Stripe products
 */
export function useStripeProducts(category: ProductCategory = 'all') {
  const [products, setProducts] = useState<Record<string, StripeProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine the type parameter based on category
        const typeParam = category !== 'all' ? `?type=${category}` : '';
        
        // Fetch products from our Supabase edge function
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-products${typeParam}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform the array into an object with product types as keys
        const productsMap: Record<string, StripeProduct> = {};
        
        data.products.forEach((product: StripeProduct) => {
          const type = product.metadata.type || 'other';
          productsMap[type] = product;
        });

        setProducts(productsMap);
      } catch (err) {
        console.error('Error fetching Stripe products:', err);
        setError('Failed to load products. Please try again later.');
        
        // Fallback to default products in case of error
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Get a specific product by type
  const getProduct = (type: string): StripeProduct | null => {
    return products[type] || null;
  };

  return {
    products,
    getProduct,
    loading,
    error,
    // Helper to get commonly used products
    subscription: products['subscription'] || null,
    donation: products['donation'] || null,
  };
}

/**
 * Fallback products to use when API is unavailable
 */
function getFallbackProducts(): Record<string, StripeProduct> {
  return {
    'subscription': {
      id: 'prod_fallback_subscription',
      name: 'Premium Access',
      description: 'Get full access to all premium features',
      priceId: 'price_fallback_subscription',
      price: '$4.99/month',
      currency: 'usd',
      mode: 'subscription',
      interval: 'month',
      metadata: { type: 'subscription' },
      images: [],
    },
    'donation': {
      id: 'prod_fallback_donation',
      name: 'Support Our App',
      description: 'Make a one-time donation to support our app development',
      priceId: 'price_fallback_donation',
      price: 'Any amount',
      currency: 'usd',
      mode: 'payment',
      interval: null,
      metadata: { type: 'donation' },
      images: [],
    }
  };
}