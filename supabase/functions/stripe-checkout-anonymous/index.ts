import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function corsResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
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
        headers: corsHeaders,
      });
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Verify we have a valid Stripe secret key
    if (!stripeSecret) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return corsResponse({ error: 'Internal server error' }, 500);
    }

    const { price_id, success_url, cancel_url, mode } = await req.json();
    console.log('Received checkout request:', { price_id, success_url, cancel_url, mode });

    // Validate required parameters
    if (!price_id || !success_url || !cancel_url || !mode) {
      console.error('Missing required parameters');
      return corsResponse(
        { error: 'Missing required parameters: price_id, success_url, cancel_url, mode' },
        400,
      );
    }

    // Validate mode is either 'payment' or 'subscription'
    if (!['payment', 'subscription'].includes(mode)) {
      return corsResponse(
        { error: "Mode must be either 'payment' or 'subscription'" },
        400,
      );
    }

    try {
      console.log('Creating Stripe checkout session...');
      // Create Checkout Session with explicit error handling
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: price_id,
            quantity: 1,
          },
        ],
        mode,
        success_url,
        cancel_url,
        billing_address_collection: 'auto',
        submit_type: mode === 'payment' ? 'donate' : 'auto',
      });

      if (!session?.url) {
        console.error('Stripe session created but no URL returned');
        return corsResponse({ error: 'Failed to create checkout session' }, 500);
      }

      return corsResponse({ 
        sessionId: session.id,
        url: session.url 
      });
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError);
      
      // Handle specific Stripe errors
      if (stripeError.type === 'StripeInvalidRequestError') {
        console.error('Stripe invalid request:', stripeError.message);
        return corsResponse({ error: stripeError.message }, 400);
      }

      console.error('Stripe error:', stripeError.message);
      return corsResponse(
        { error: 'Payment service error. Please try again later.' },
        500,
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return corsResponse(
      { error: 'Server error. Please try again later.' },
      500,
    );
  }
});