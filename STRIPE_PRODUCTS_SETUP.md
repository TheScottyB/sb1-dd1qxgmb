# Setting Up Stripe Products for Dynamic Loading

This guide explains how to set up your Stripe products to work with our dynamic product loading system.

## Overview

Instead of hardcoding product IDs and details in your app:
1. You create and configure products in the Stripe dashboard
2. Your app fetches product information dynamically
3. Changes in Stripe are automatically reflected in your app

## Benefits

- No code changes needed when updating product details
- Consistent product information across platforms
- Ability to modify pricing without app updates
- Streamlined product management

## Product Setup in Stripe

### Step 1: Create Products in Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ensure you're in the correct mode (Test or Live)
3. Navigate to "Products" in the sidebar
4. Click "Add Product"

### Step 2: Configure Products with Required Metadata

For each product, set up the following:

**Basic Information:**
- Name: A clear product name (e.g., "Premium Access")
- Description: A concise product description

**Pricing:**
- Create a price for the product
- For subscriptions, set the recurring parameters
- For one-time payments, select "One time"

**Important: Add Metadata**
The app relies on metadata to categorize products. Add these metadata fields:

- `type`: The product category for the app to recognize it
  - Use `subscription` for subscription products
  - Use `donation` for donation products
  - You can add other types as needed

Example metadata:
```
type: subscription
display_name: Premium Plan
```

### Step 3: Optional Metadata Fields

You can add additional metadata to control product display:

- `display_price`: Custom price display (e.g., "Starting at $4.99")
- `display_name`: Alternative display name
- `order`: Numeric value to control display order
- `feature_1`, `feature_2`, etc.: Features to highlight
- `icon`: Icon name to display with product

## Examples

### Example 1: Subscription Product

Create a "Premium Access" product with:
- Name: Premium Access
- Description: Get full access to all premium features
- Price: $4.99/month (recurring)
- Metadata:
  - type: subscription
  - order: 1

### Example 2: Donation Product

Create a "Support Our App" product with:
- Name: Support Our App
- Description: Make a one-time donation to support our app
- Price: Any amount (one-time)
- Metadata:
  - type: donation
  - display_price: Any amount

## Testing Your Products

After setting up products in Stripe:

1. Deploy the `stripe-products` function to Supabase:
   ```bash
   supabase functions deploy stripe-products --project-ref your-project-id
   ```

2. Test the function by making a request:
   ```bash
   curl -X GET "https://your-project.supabase.co/functions/v1/stripe-products" \
     -H "Authorization: Bearer your-anon-key"
   ```

3. Verify the products appear correctly in your app

## When to Redeploy

- The app automatically fetches the latest product data
- You DON'T need to redeploy when:
  - Changing product names, descriptions, or prices
  - Adding/updating metadata
  - Creating new products

- You only need to redeploy when:
  - Modifying the structure of the products function
  - Changing how products are fetched or processed

## Troubleshooting

If products don't appear correctly:

1. Verify the product is active in Stripe
2. Check that the metadata includes the correct `type` field
3. Ensure the price is active
4. Check for errors in the Supabase function logs