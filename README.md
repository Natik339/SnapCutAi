## SnapCut

Live: https://snap-cut-ai-sepia.vercel.app/

SnapCut is a fast, credit-based AI background removal web app with authentication, history, downloads, and a Pro subscription flow.

---

## Core Features

- **One‑click background removal**: Upload an image (drag/drop/paste/browse) and remove the background via an external processing webhook.
- **Authentication (Supabase Auth)**: Email/password sign up + sign in, email verification callback, forgot/reset password.
- **Credits system (Supabase DB)**:
  - New users start with **2 free credits**
  - Each successful background removal consumes **1 credit**
  - Credits are stored and updated in the database (not client-only)
  - Deleting history does **not** restore credits
- **Pro plan**:
  - “Pro” grants **10 monthly credits** (with expiry window as stored in the profile)
  - Upgrade UX uses in-app dialogs (no browser alerts)
  - Thank‑you message shown after successful purchase
- **History (Supabase DB + optional guest local cache)**:
  - Stores processed results with filename, timestamps, generation time, and download count
  - Rename files in history
  - Delete history items (removes from database)
  - Track download count per image
  - Preview processed image in a popup (eye icon on hover)
- **Premium UI**:
  - Polished download buttons
  - Subtle credit banner that shows “You can process X more images with Y credits left”
- **Branding**: Fully white-labeled to **SnapCut**

---

## USP (What Makes SnapCut Different)

- **Credit-aware UX**: Users always know how many images they can still process.
- **Audit-friendly history**: Rename, preview, download count, and generation time stored per image.
- **Production-ready auth**: Email confirmation callback route and password reset flow.
- **Webhook automation ready**: Purchase events are pushed to an automation webhook for CRM/email/analytics.

---

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing/SSR**: TanStack Router + TanStack Start
- **Build tooling**: Vite
- **UI**: Tailwind CSS + Radix UI components (shadcn-style)
- **Auth + Database**: Supabase (Auth + Postgres + RLS)
- **Payments**: Razorpay Checkout
- **Automation/Webhooks**: n8n webhooks
- **Deployment**: Vercel (Nitro preset for Vercel)

---

## Key Routes

- `/` Home (upload + process + pricing + history tab)
- `/dashboard` Dashboard (profile, stats, history)
- `/login` Sign in
- `/signup` Sign up
- `/auth/callback` Email verification callback handler
- `/forgot-password` Password reset request
- `/reset-password` Set new password
- `/contact-us` Support / API access CTA
- Legal: `/privacy-policy`, `/terms-conditions`, `/refund-policy`, `/shipping-delivery`

---

## External APIs / Webhooks

These are the external endpoints SnapCut interacts with:

- **Background removal webhook**
  - `POST https://natikg16.app.n8n.cloud/webhook/remove-background`
  - Sends: `multipart/form-data` with `image` file
  - Expects: processed image URL response (used to store history + show result)

- **Purchase webhook**
  - `POST https://natikg16.app.n8n.cloud/webhook/purchase-made`
  - Sends: structured JSON payload containing customer info, payment info, plan info, and a profile snapshot

Note: These endpoints are external to this repo. Ensure they are available and configured in your automation platform.

---

## Environment Variables

Create `.env` locally (never commit real secrets). Vercel environment variables should match these.

**Public (client)**

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `VITE_RAZORPAY_KEY_ID` — Razorpay publishable key id

**Server-only**

- `SUPABASE_URL` — Supabase project URL (same value as `VITE_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (never expose to client)

---

## Database Setup (Supabase)

This project expects tables and policies for:

- `user_profiles` (credits, plan, pro expiry)
- `image_history` (original/processed URLs, filename, download count, generation time)
- `processing_history` (if enabled by your schema)

Use the SQL scripts in the repo to create tables + RLS policies:

- `supabase-schema.sql`
- `supabase-schema-simple.sql` (step-by-step, easier to run)

Make sure RLS policies allow a signed-in user to access only their data:

- `auth.uid() = id` for `user_profiles`
- `auth.uid() = user_id` for `image_history`

---

## Local Development

From the project folder:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

## Deploying to Vercel

1. Import the repo in Vercel
2. Set the **Root Directory** to `fade-out-ai` (if the repo contains multiple folders)
3. Framework preset: **Other**
4. Add the env vars listed above (Production + Preview)
5. Deploy

### Supabase Auth URL Configuration (Important)

In Supabase → Authentication → URL Configuration:

- **Site URL**:
  - `https://snap-cut-ai-sepia.vercel.app`
- **Redirect URLs** (add both):
  - `https://snap-cut-ai-sepia.vercel.app/auth/callback`
  - `http://localhost:5173/auth/callback` (for local dev, optional)

---

## Notes / Common Issues

- **Email confirmation opens localhost**: The link was generated before updating Supabase URL config, or created from local dev. Generate a new confirmation email after fixing Supabase settings.
- **Vercel uses prebuilt artifacts**: Do not commit `.vercel/output`. Keep `.vercel/` in `.gitignore`.
- **“No credits” while DB shows credits**: Usually RLS/GRANT configuration. Ensure authenticated role has correct permissions and policies.
