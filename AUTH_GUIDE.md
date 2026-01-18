# 🚀 PALETTE | Zero to Complete Auth Guide

If you are seeing a **404 error** on GitHub login or your **Email links** aren't working, it's because Supabase doesn't know where to send the user back to. Follow these exact steps to fix it.

---

## 1. The "Site URL" Fix (Most Important)
Supabase needs to know your Vercel URL to redirect users correctly.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project: `mmmfebmyxmcyirncalqw`.
3.  Go to **Authentication** (sidebar) > **Settings** > **URL Configuration**.
4.  **Site URL**: Change this to exactly:
    `https://palette-test-murex.vercel.app`
5.  **Redirect URLs**: Add these two lines:
    *   `https://palette-test-murex.vercel.app/**`
    *   `http://localhost:5173/**` (for when you test locally)
6.  Click **Save**.

---

## 2. GitHub OAuth Fix (Fixes the 404)
If GitHub redirects to a 404, your GitHub App settings are likely pointing to the wrong place.

1.  Go to your [GitHub Developer Settings](https://github.com/settings/developers).
2.  Find your OAuth App for PALETTE.
3.  **Homepage URL**: Set to `https://palette-test-murex.vercel.app`.
4.  **Authorization callback URL**: This **MUST** come from Supabase.
    *   In Supabase, go to **Authentication** > **Providers** > **GitHub**.
    *   Copy the **Callback URL** shown there (it looks like `https://mmmfebmyxmcyirncalqw.supabase.co/auth/v1/callback`).
    *   Paste that into GitHub's "Authorization callback URL" field.
5.  Click **Update application**.

---

## 3. Email Login Fix
If you get the email but the link doesn't log you in:

1.  In Supabase, go to **Authentication** > **Providers** > **Email**.
2.  Ensure **Confirm Email** is **OFF** (for easier testing).
3.  Ensure **Secure email change** is **OFF**.
4.  The "Magic Link" will now use the **Site URL** we set in Step 1.

---

## 4. Database Tables (The "X-Factor")
Since you created tables, ensure your `profiles` table exists so the app can store user data:

```sql
-- Run this in the Supabase SQL Editor if you haven't already
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create a policy to allow users to see their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
```

---

## Summary Checklist
- [ ] Supabase Site URL = `https://palette-test-murex.vercel.app`
- [ ] Supabase Redirect URLs = `https://palette-test-murex.vercel.app/**`
- [ ] GitHub Callback URL = Matches Supabase Provider URL
- [ ] Email Provider = Confirm Email is OFF

**Once you do these 4 things, refresh your app and it will work perfectly!**
