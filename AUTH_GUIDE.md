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

## 2. Create & Connect GitHub OAuth (Fixes the 404)
Since you don't have an OAuth app yet, here is how to create one:

### A. Create the App on GitHub
1.  Go to your [GitHub Developer Settings](https://github.com/settings/developers).
2.  Click **New OAuth App**.
3.  **Application Name**: `PALETTE`
4.  **Homepage URL**: `https://palette-test-murex.vercel.app`
5.  **Authorization callback URL**: 
    *   Go to your [Supabase Dashboard](https://supabase.com/dashboard).
    *   Go to **Authentication** > **Providers** > **GitHub**.
    *   Copy the **Callback URL** shown there (it looks like `https://mmmfebmyxmcyirncalqw.supabase.co/auth/v1/callback`).
    *   Paste this into the GitHub field.
6.  Click **Register application**.

### B. Connect to Supabase
1.  On your new GitHub App page, copy the **Client ID**.
2.  Click **Generate a new client secret** and copy that too.
3.  Go back to **Supabase** > **Authentication** > **Providers** > **GitHub**.
4.  Paste the **Client ID** and **Client Secret**.
5.  Click **Save**.

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
