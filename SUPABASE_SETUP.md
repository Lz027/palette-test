# Supabase Setup Guide for PALETTE

To ensure the authentication and database work correctly with your Vercel deployment, please follow these steps in your [Supabase Dashboard](https://app.supabase.com/).

## 1. Authentication Settings
Go to **Authentication > Settings > Site URL**.

*   **Site URL**: `https://palette-test-murex.vercel.app`
*   **Redirect URLs**: Add `https://palette-test-murex.vercel.app/**` to the list of allowed redirect URLs.

## 2. GitHub Auth Configuration
Go to **Authentication > Providers > GitHub**.

1.  Ensure **Enable GitHub Auth** is toggled ON.
2.  Copy the **Callback URL** provided by Supabase.
3.  Go to your [GitHub Developer Settings](https://github.com/settings/developers) and update your OAuth App:
    *   **Homepage URL**: `https://palette-test-murex.vercel.app`
    *   **Authorization callback URL**: Paste the URL you copied from Supabase.

## 3. Email Auth Configuration
Go to **Authentication > Providers > Email**.

1.  Ensure **Enable Email Signup** is ON.
2.  Ensure **Confirm Email** is OFF (if you want immediate access via Magic Link).
3.  Ensure **Secure Email Change** is ON.

## 4. Database Tables
The app expects the following tables to exist. Ensure they are created and have the correct permissions (RLS).

### `profiles`
- `id`: uuid (references auth.users)
- `username`: text
- `avatar_url`: text
- `updated_at`: timestamp

### `boards`
- `id`: uuid (primary key)
- `user_id`: uuid (references auth.users)
- `title`: text
- `description`: text
- `created_at`: timestamp

### `palette_items`
- `id`: uuid (primary key)
- `board_id`: uuid (references boards)
- `type`: text (e.g., 'color', 'image', 'font')
- `content`: jsonb
- `position`: integer

## 5. Environment Variables (Vercel)
In your Vercel Project Settings, ensure these variables are set:

*   `VITE_SUPABASE_URL`: `https://mmmfebmyxmcyirncalqw.supabase.co`
*   `VITE_SUPABASE_ANON_KEY`: (Your Anon Key)

---
**Note**: If you see a 404 after login, it usually means the "Site URL" in Supabase is still set to `localhost:5173` instead of your Vercel URL.
