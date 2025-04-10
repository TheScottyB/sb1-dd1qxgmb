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