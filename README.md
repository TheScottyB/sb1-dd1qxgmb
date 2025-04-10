# MyApp - Premium Subscription App

A premium mobile application built with Expo and React Native, featuring Stripe integration for subscriptions and payments.

## Features

- 🔐 User authentication with Supabase
- 💳 Subscription management with Stripe
- 💸 One-time donation payments
- 🎨 Modern UI with animations and haptic feedback
- 📱 Cross-platform (iOS, Android, Web) support

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/my-app.git
cd my-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Update the Stripe configuration in `src/stripe-config.ts` with your live product and price IDs from the Stripe dashboard.

### Running the App

```bash
# Start the development server
npm run dev

# Build for web
npm run build:web
```

## Deployment

### iOS App Store

1. Configure your app in `app.json`:
   - Update the bundleIdentifier
   - Add required permissions
   - Configure the splash screen and icons

2. Build the app:
```bash
eas build --platform ios
```

3. Submit to the App Store:
```bash
eas submit --platform ios
```

## Supabase Edge Functions

This project uses Supabase Edge Functions for handling Stripe checkout and webhooks:

- `stripe-checkout`: Creates a checkout session for authenticated users
- `stripe-checkout-anonymous`: Creates a checkout session for one-time payments without requiring authentication
- `stripe-webhook`: Handles Stripe webhook events

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
- [React Native](https://reactnative.dev/)