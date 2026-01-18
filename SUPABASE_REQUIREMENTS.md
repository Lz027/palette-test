# PALETTE | Supabase Configuration Guide

To ensure the authentication and redirects work perfectly, please configure your Supabase project with the following settings:

## 1. Authentication Settings
Go to **Authentication > Settings > URL Configuration**:

*   **Site URL**: `https://palette-test-murex.vercel.app`
*   **Redirect URLs**: 
    *   `https://palette-test-murex.vercel.app/**`
    *   `http://localhost:5173/**` (for local development)

## 2. External Providers (GitHub)
Go to **Authentication > Providers > GitHub**:

1.  **Enable GitHub**: Toggle to ON.
2.  **Client ID & Secret**: Enter the values from your GitHub OAuth App.
3.  **Callback URL**: Copy the URL provided by Supabase and paste it into your GitHub OAuth App settings.

## 3. Email Auth
Go to **Authentication > Providers > Email**:

1.  **Enable Email**: Toggle to ON.
2.  **Confirm Email**: You can toggle this OFF for easier testing, or ON for better security.
3.  **Magic Link**: Ensure "Enable Magic Link" is ON.

## 4. Database Tables (Optional but Recommended)
If you want to sync data to the cloud in the future, ensure you have these tables:

*   `profiles` (id, email, full_name, avatar_url)
*   `boards` (id, user_id, name, color, template_type, etc.)
*   `tasks` (id, board_id, group_id, title, status, etc.)

**Note**: Currently, the app uses a hybrid approach with robust Local Storage to ensure your data is never lost even if the connection is unstable.

---
**Need help?** Just ask Pal or Manus!
