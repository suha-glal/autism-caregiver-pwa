# Supabase Security Guide for Direct Frontend Integration

This guide explains how to set up and configure Supabase security for the Autism Caregiver PWA, ensuring that your data remains secure when using Supabase directly from the frontend.

## Row Level Security (RLS) Setup

Row Level Security is critical when connecting directly to Supabase from the frontend. It ensures that users can only access their own data, even if they have direct database access.

### Step 1: Create the Database Schema

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/schema.sql` into the editor
4. Run the SQL commands to create the table and set up RLS policies

### Step 2: Verify RLS Policies

After running the schema SQL, verify that the following policies are in place:

1. Go to the "Authentication" section in your Supabase dashboard
2. Click on "Policies" in the sidebar
3. Find the `logs` table and verify these policies exist:
   - "Users can insert their own logs"
   - "Users can view their own logs"
   - "Users can update their own logs"
   - "Users can delete their own logs"

### Step 3: Test RLS Policies

To ensure your RLS policies are working correctly:

1. Create two test users in the Authentication section
2. Use the Supabase dashboard to insert a log entry for one user
3. Sign in as the other user and verify they cannot see the first user's logs
4. Sign in as the first user and verify they can see their own logs

## Authentication Configuration

### Step 1: Enable Email Authentication

1. Go to the "Authentication" section in your Supabase dashboard
2. Click on "Providers" in the sidebar
3. Ensure "Email" is enabled
4. Configure password requirements if needed

### Step 2: Configure Email Templates (Optional)

1. Go to the "Authentication" section
2. Click on "Email Templates"
3. Customize the templates for:
   - Confirmation email
   - Invitation email
   - Magic link email
   - Reset password email

### Step 3: Set Up Redirect URLs

1. Go to the "Authentication" section
2. Click on "URL Configuration"
3. Add your application's URL to the allowed redirect URLs
4. Set the Site URL to your application's main URL

## API Security

### Step 1: Restrict API Access

1. Go to the "API" section in your Supabase dashboard
2. Note your project's URL and anon/public key (you'll need these for your frontend)
3. **Never** expose your service key in the frontend code

### Step 2: Set Up CORS (Cross-Origin Resource Sharing)

1. Go to the "API" section
2. Click on "Settings" in the sidebar
3. Add your application's domain to the allowed origins

## Frontend Environment Setup

1. Create a `.env` file based on `.env.example`
2. Add your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Make sure `.env` is in your `.gitignore` file to avoid exposing credentials

## Security Best Practices

1. **Never** store sensitive data in localStorage without encryption
2. Use HTTPS for all production deployments
3. Implement proper input validation on the frontend
4. Regularly audit your RLS policies as your application evolves
5. Consider implementing additional client-side validation for critical operations
6. Regularly rotate your Supabase API keys

## Troubleshooting RLS Issues

If users cannot access their data or can access others' data:

1. Verify that the `user_id` column in your tables matches the Supabase Auth user ID
2. Check that RLS is enabled on the table
3. Review your policy definitions for syntax errors
4. Ensure users are properly authenticated before accessing data
5. Check the Supabase logs for any policy evaluation errors
