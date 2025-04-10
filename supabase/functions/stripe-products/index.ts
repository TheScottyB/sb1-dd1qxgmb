import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret);

// Helper function to create responses with CORS headers
function corsResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (req.method !== 'GET') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Verify we have a valid Stripe secret key
    if (!stripeSecret) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return corsResponse({ error: 'Internal server error' }, 500);
    }

    const url = new URL(req.url);
    const productType = url.searchParams.get('type');

    // Fetch active products from Stripe
    const productsResponse = await stripe.products.list({
      active: true,
      limit: 100,
    });

    // Filter products based on type if specified
    let filteredProducts = productsResponse.data;
    if (productType) {
      filteredProducts = filteredProducts.filter(product => 
        product.metadata.type === productType
      );
    }

    // Get prices for each product
    const productData = await Promise.all(
      filteredProducts.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
        });

        const defaultPrice = prices.data[0];

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          priceId: defaultPrice?.id,
          price: defaultPrice ? formatPrice(defaultPrice) : null,
          currency: defaultPrice?.currency,
          mode: defaultPrice?.type === 'recurring' ? 'subscription' : 'payment',
          interval: defaultPrice?.type === 'recurring' ? defaultPrice.recurring?.interval : null,
          metadata: product.metadata,
          images: product.images,
        };
      })
    );

    return corsResponse({ products: productData });

  } catch (error) {
    console.error('Error fetching products:', error);
    return corsResponse({ error: 'Failed to fetch products' }, 500);
  }
});

// Helper function to format price based on currency and amount
function formatPrice(price: any): string {
  const amount = price.unit_amount / 100;
  
  if (price.type === 'recurring') {
    const interval = price.recurring.interval;
    const intervalCount = price.recurring.interval_count;
    
    if (intervalCount === 1) {
      return `$${amount}/${interval}`;
    } else {
      return `$${amount} every ${intervalCount} ${interval}s`;
    }
  } else if (price.type === 'one_time') {
    return `$${amount}`;
  } else {
    return price.metadata.display_price || `$${amount}`;
  }
}