# Setting Up Stripe Live Mode

This guide will walk you through the process of setting up Stripe in live mode for your application.

## 1. Update Product and Price IDs

Replace the placeholder IDs in `src/stripe-config.ts` with your actual live mode Stripe product and price IDs.

```typescript
export const products = {
  sandbox: {
    id: 'prod_YourLiveProductID', // Replace with your actual live product ID
    name: 'Premium Access',
    description: 'Get full access to all premium features',
    price: '$4.99/month',
    priceId: 'price_YourLivePriceID', // Replace with your actual live price ID
    mode: 'subscription' as const,
  },
  donation: {
    id: 'prod_YourLiveDonationID', // Replace with your actual live donation product ID
    name: 'Support Our App',
    description: 'Make a one-time donation to support our app development',
    price: 'Any amount',
    priceId: 'price_YourLiveDonationPriceID', // Replace with your actual live donation price ID
    mode: 'payment' as const,
  },
} as const;
```

## 2. Update Supabase Edge Functions

### Get Your Stripe Live Mode Secret Key

1. Log in to your Stripe dashboard
2. Make sure you're in "Live mode" (toggle at the top right)
3. Go to Developers > API keys
4. Copy the "Secret key" (starts with "sk_live_")

### Update Supabase Environment Variables

1. Log in to your Supabase dashboard
2. Go to your project
3. Navigate to Settings > API
4. In the Edge Functions section, click "Edit Environment Variables"
5. Update the `STRIPE_SECRET_KEY` environment variable with your live mode secret key
6. Save changes

If the environment variable doesn't exist, add it:
- Variable name: `STRIPE_SECRET_KEY`
- Value: `sk_live_your_live_mode_secret_key`

### Deploy the Edge Functions

```bash
# Navigate to your project directory
cd /path/to/your/project

# Make sure you have Supabase CLI installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-checkout-anonymous
supabase functions deploy stripe-webhook
```

## 3. Test the Integration

1. Make a small test purchase using a real card
2. Verify that the transaction appears in your Stripe dashboard
3. Check that the webhook is working properly by looking at the Supabase logs

## 4. Troubleshooting

If you encounter any issues:

1. Check the Supabase Edge Function logs for errors
2. Verify that the product and price IDs in the code match those in your Stripe dashboard
3. Ensure the Stripe secret key is set correctly in Supabase environment variables
4. Check that the webhook is configured correctly in the Stripe dashboard

## Important Notes

- **Never commit your live mode secret key to your repository**
- Always test thoroughly in test mode before switching to live mode
- Ensure your app has proper error handling for payment failures
- Make sure your privacy policy and terms of service are updated to reflect payment processing

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Expo Linking Documentation](https://docs.expo.dev/guides/linking/)