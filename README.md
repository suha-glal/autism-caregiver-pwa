# Autism Caregiver PWA - Direct Supabase Integration

This is a Progressive Web Application (PWA) designed to help caregivers of children with autism track and label emotional or behavioral states. This version uses Supabase directly from the frontend with proper Row Level Security (RLS) policies.

## Features

- **Offline-First Behavior**: Record data even without internet connection
- **Automatic Syncing**: Data syncs automatically when internet connection is restored
- **User Authentication**: Secure login and signup functionality via Supabase Auth
- **High-Contrast UI**: Accessible design with dark mode support
- **Mobile-Friendly**: Responsive design that works well on all devices
- **Installable**: Can be installed as a Progressive Web App on mobile and desktop

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, or pnpm
- Supabase account

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Create a `.env` file based on `.env.example` and update with your Supabase credentials
4. Start the development server:
   ```
   pnpm dev
   ```

## Supabase Setup

1. Create a new Supabase project at https://app.supabase.com
2. Set up the database schema:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL commands from `supabase/schema.sql`
3. Configure authentication:
   - Enable Email/Password sign-in
   - Configure email templates if desired
4. Get your Supabase URL and anon key from the API settings
5. Add these to your `.env` file

## Security

This application connects directly to Supabase from the frontend, which requires proper security configuration:

1. Row Level Security (RLS) policies are essential - see `docs/supabase-security-guide.md` for detailed setup instructions
2. Never expose your service key in the frontend code
3. Always use the anon/public key for frontend connections

## Architecture

This application follows a direct-to-Supabase architecture:

- Frontend React components connect directly to Supabase
- Offline data is stored in localStorage and synced when online
- Authentication is handled by Supabase Auth
- Data security is enforced by Supabase RLS policies

## Building for Production

```
pnpm build
```

The built files will be in the `dist` directory.

## Deployment

1. Build the application
2. Deploy the `dist` directory to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

## Documentation

- `docs/supabase-security-guide.md` - Detailed guide for setting up Supabase security
