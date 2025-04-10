# CLAUDE.md - Project Guide for Agentic Assistants

## Commands
- `npm run dev` - Start the development server
- `npm run build:web` - Build for web platform
- `npm run lint` - Run linting

## Code Style Guidelines
- **Formatting**: Use Prettier with 2 spaces, no tabs, and single quotes
- **Imports**: Group imports by type (React, Expo, local files)
- **Types**: Use TypeScript with strict mode enabled; explicitly define state types
- **Error Handling**: Use try/catch with specific error messages and logging
- **Component Structure**: Prefer functional components with hooks
- **File Organization**: Use expo-router file-based routing under `/app`
- **Styling**: Use StyleSheet.create for styles; group related styles together
- **Platform-specific code**: Use Platform.select for platform differences
- **Path aliases**: Use `@/` alias for imports from project root

## Environment
- Project is built with Expo 52 and expo-router
- Uses Supabase for backend and Stripe for payments
- TypeScript strict mode is enabled