# Stripe Live Mode Setup for Demo

This guide explains how to set up Stripe in live mode for your demo.

## 1. Create Products in Stripe Dashboard

### Subscription Product
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/products) in **LIVE MODE**
2. Click "Add Product"
3. Set up the product:
   - Name: Premium Access
   - Description: Get full access to all premium features
   - Pricing: $4.99/month (recurring)
4. Note the Product ID and Price ID after creation

### Donation Product
1. Still in Stripe Dashboard live mode, click "Add Product" again
2. Set up the donation:
   - Name: Support Our App
   - Description: Make a one-time donation to support our app development
   - Pricing: Custom amount (one-time)
3. Note the Product ID and Price ID after creation

## 2. Update stripe-config.ts

Open `/src/stripe-config.ts` and replace the placeholder IDs with your actual Stripe live mode IDs:

```typescript
// LIVE MODE CONFIGURATION
export const products = {
  sandbox: {
    id: 'prod_xxxxxxxx', // Your actual subscription product ID
    name: 'Premium Access',
    description: 'Get full access to all premium features',
    price: '$4.99/month',
    priceId: 'price_xxxxxxxx', // Your actual subscription price ID
    mode: 'subscription' as const,
  },
  donation: {
    id: 'prod_xxxxxxxx', // Your actual donation product ID
    name: 'Support Our App',
    description: 'Make a one-time donation to support our app development',
    price: 'Any amount',
    priceId: 'price_xxxxxxxx', // Your actual donation price ID
    mode: 'payment' as const,
  },
} as const;
```

## 3. Configure Supabase Environment Variables

Use the `update-supabase-env.js` script or GitHub Actions to set these environment variables:

- `STRIPE_SECRET_KEY`: Your Stripe live mode secret key (starts with `sk_live_`)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe live mode webhook secret (starts with `whsec_`)

## 4. Deploy Supabase Functions

Deploy the updated functions to Supabase:

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-checkout-anonymous
supabase functions deploy stripe-webhook
```

## 5. Test the Integration

1. Make a small test purchase using a real card
2. Verify the transaction appears in your Stripe dashboard
3. Check that the subscription status updates correctly in your app

## Important Notes for the Demo

- Use a real card for testing in live mode (test cards won't work)
- Keep transaction amounts small for testing
- Stripe live mode processes actual payments
- Consider using Stripe Radar rules to block suspicious transactions during the demo