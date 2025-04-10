// PRODUCTION CONFIGURATION - LIVE MODE
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

/**
 * HOW TO GET YOUR LIVE PRODUCT AND PRICE IDs:
 * 
 * 1. Go to the Stripe Dashboard
 * 2. Make sure you're in "Live mode" (toggle at top right)
 * 3. Go to Products > Click on your product
 * 4. The Product ID is shown as "ID" (starts with "prod_")
 * 5. The Price ID is shown in the Pricing section (starts with "price_")
 * 
 * Make sure to replace the IDs above with your actual live product and price IDs.
 * 
 * IMPORTANT: Make sure your live mode Stripe secret key is set in Supabase
 * environment variables (STRIPE_SECRET_KEY) for the edge functions.
 */

// For development/testing, uncomment this block and comment out the above
/*
export const products = {
  sandbox: {
    id: 'prod_S6czqesqmNyeEW',
    name: 'a nice sandbox to play in',
    description: 'Get access to our sandbox environment',
    price: '$1.00/month',
    priceId: 'price_1RCPjYD7HlCF3t1EPnbTc9rv',
    mode: 'subscription' as const,
  },
  donation: {
    id: 'prod_S6dMh0JiQvICg3',
    name: 'Donation to the cause',
    description: 'Support our project with a one-time donation',
    price: 'Any amount',
    priceId: 'price_1RCQ5KD7HlCF3t1Eth6hheUm',
    mode: 'payment' as const,
  },
} as const;
*/