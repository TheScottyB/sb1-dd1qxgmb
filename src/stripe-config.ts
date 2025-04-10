export const products = {
  // Use your actual live mode product and price IDs from Stripe dashboard
  sandbox: {
    id: 'prod_live_id', // Replace with your live product ID
    name: 'Premium Access',
    description: 'Get full access to all premium features',
    price: '$4.99/month',
    priceId: 'price_live_id', // Replace with your live price ID
    mode: 'subscription' as const,
  },
  donation: {
    id: 'prod_live_donation_id', // Replace with your live donation product ID
    name: 'Support Our App',
    description: 'Make a one-time donation to support our app development',
    price: 'Any amount',
    priceId: 'price_live_donation_id', // Replace with your live donation price ID
    mode: 'payment' as const,
  },
} as const;

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