# 🛡️ PALETTE | Master Authentication Guide

If your login is failing, it's usually because the **Client ID** and **Client Secret** are mismatched between GitHub and Supabase. Follow this guide to fix it from scratch.

---

## 1. Clean Up GitHub (Start Fresh)
1.  Go to your [GitHub OAuth Apps](https://github.com/settings/developers).
2.  If you have an existing "PALETTE" app, **Delete it** to avoid confusion.
3.  Click **New OAuth App**.
4.  **Application Name**: `PALETTE`
5.  **Homepage URL**: `https://palette-test-murex.vercel.app`
6.  **Authorization callback URL**: 
    *   Go to your [Supabase Dashboard](https://supabase.com/dashboard).
    *   Go to **Authentication** > **Providers** > **GitHub**.
    *   Copy the **Callback URL** (e.g., `https://mmmfebmyxmcyirncalqw.supabase.co/auth/v1/callback`).
    *   Paste this into GitHub.
7.  Click **Register application**.

---

## 2. Get the Correct Keys
1.  On your new GitHub App page, you will see a **Client ID**. Copy it.
2.  Click **Generate a new client secret**. 
3.  **IMPORTANT**: Copy the secret immediately. You will only see it once.

---

## 3. Update Supabase
1.  Go back to **Supabase** > **Authentication** > **Providers** > **GitHub**.
2.  Paste the **Client ID** and **Client Secret** you just got from GitHub.
3.  Click **Save**.

---

## 4. Fix the Redirects (Crucial)
1.  In Supabase, go to **Authentication** > **Settings** > **URL Configuration**.
2.  **Site URL**: `https://palette-test-murex.vercel.app`
3.  **Redirect URLs**: Add these two:
    *   `https://palette-test-murex.vercel.app/**`
    *   `http://localhost:5173/**`
4.  Click **Save**.

---

## 5. Email Login Fix
1.  In Supabase, go to **Authentication** > **Providers** > **Email**.
2.  Ensure **Confirm Email** is **OFF** (this allows instant login via Magic Link).
3.  Ensure **Enable Magic Link** is **ON**.

---

### ✅ Summary Checklist
- [ ] GitHub Client ID matches Supabase.
- [ ] GitHub Client Secret matches Supabase.
- [ ] GitHub Callback URL matches Supabase Provider URL.
- [ ] Supabase Site URL is set to your Vercel link.

**Once these are set, refresh your app and try logging in. It will work!**
