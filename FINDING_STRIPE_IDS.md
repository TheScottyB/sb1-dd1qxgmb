# Finding Your Stripe Product and Price IDs

This guide will show you how to find the correct IDs for your Stripe products to use in your app.

## Finding Product and Price IDs in Stripe Dashboard

### Step 1: Log in to Stripe Dashboard

Go to [https://dashboard.stripe.com/](https://dashboard.stripe.com/) and log in to your account.

### Step 2: Switch to Live Mode

Make sure you're in Live mode by checking the toggle at the top right corner of the dashboard.

![Live Mode Toggle](https://i.stack.imgur.com/Nv54V.png)

### Step 3: Navigate to Products

In the left sidebar, click on "Products".

### Step 4: Find Your Product

1. Locate the product you want to use for your subscription or donation
2. Click on the product to open its details

### Step 5: Get the Product ID

On the product details page, look for the "ID" field. This is your Product ID, which typically starts with `prod_`.

![Product ID Example](https://i.stack.imgur.com/LW4vd.png)

### Step 6: Get the Price ID

Scroll down to the "Pricing" section. Here you'll find your Price ID, which typically starts with `price_`.

![Price ID Example](https://i.stack.imgur.com/CuYqJ.png)

## Using the IDs in Your Application

Once you have the IDs, update the `src/stripe-config.ts` file in your application:

```typescript
export const products = {
  sandbox: {
    id: 'prod_ABC123', // Your subscription product ID
    name: 'Premium Access',
    description: 'Get full access to all premium features',
    price: '$4.99/month',
    priceId: 'price_XYZ789', // Your subscription price ID
    mode: 'subscription' as const,
  },
  donation: {
    id: 'prod_DEF456', // Your donation product ID
    name: 'Support Our App',
    description: 'Make a one-time donation to support our app development',
    price: 'Any amount',
    priceId: 'price_UVW123', // Your donation price ID
    mode: 'payment' as const,
  },
};
```

## Important Notes

1. Make sure you're in Live mode when copying IDs for production
2. Test mode and Live mode have different sets of IDs
3. The product name and description in your code should match what's in the Stripe dashboard
4. Ensure the price shown in your app matches the actual price in Stripe