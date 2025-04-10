# Supabase Environment Variables Automation

This guide explains how to use the automated environment variable management system for Supabase Edge Functions.

## How It Works

1. Environment variables for Supabase Edge Functions are managed through:
   - Local script for manual updates
   - GitHub Actions for automated deployment updates

2. The system supports different environments (production/staging) to control whether Stripe is in live or test mode.

## Local Setup and Updates

### Initial Setup

1. Create your `.env.supabase` file based on the template:

```bash
cp .env.supabase.template .env.supabase
```

2. Edit the `.env.supabase` file with your actual values:

```
SUPABASE_ACCESS_TOKEN=your_actual_token
SUPABASE_PROJECT_ID=your_project_id
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Make sure the file is in your `.gitignore` to prevent accidental commits of secrets.

### Updating Environment Variables Manually

Run the provided script:

```bash
node scripts/update-supabase-env.js
```

This script will:
- Read values from your `.env.supabase` file
- Display current environment variables
- Ask for confirmation before updating
- Update the environment variables in your Supabase project

## CI/CD Automation with GitHub Actions

The GitHub Actions workflow (`.github/workflows/deploy-and-update-env.yml`) automatically:

1. Deploys Supabase Edge Functions
2. Updates environment variables

### Setting Up GitHub Actions

1. Add the following secrets to your GitHub repository:
   - `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
   - `SUPABASE_PROJECT_ID`: Your Supabase project ID
   - `STRIPE_SECRET_KEY`: Your Stripe live mode secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe live mode webhook secret
   - `STRIPE_TEST_SECRET_KEY`: Your Stripe test mode secret key
   - `STRIPE_TEST_WEBHOOK_SECRET`: Your Stripe test mode webhook secret

2. The workflow will run automatically when:
   - Changes are pushed to the `main` branch that affect Supabase files
   - The workflow is manually triggered

### Manual Trigger

You can manually trigger the deployment with:
1. Go to your GitHub repository
2. Click the "Actions" tab
3. Select "Deploy and Update Environment Variables"
4. Click "Run workflow"
5. Choose the environment (production/staging)

## Environment Management

- **Production**: Uses Stripe live mode keys for processing real payments
- **Staging**: Uses Stripe test mode keys for safe testing

## Adding New Environment Variables

To add new environment variables:

1. Add them to your `.env.supabase` file
2. Update the GitHub Actions workflow to include the new variables as secrets
3. Run the update script locally or trigger the GitHub workflow

## Troubleshooting

If you encounter issues:

1. Check that your Supabase CLI is installed and working:
   ```bash
   supabase --version
   ```

2. Verify you have the correct permissions for your project:
   ```bash
   supabase projects list
   ```

3. Check the GitHub Actions logs for detailed error messages.