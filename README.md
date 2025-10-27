# Strava Analyzer

Nuxt 4 dashboard that pulls the last 90 days of Strava runs, surfaces rolling volume/effort stats, previews routes, and lets you copy a weather-enriched JSON summary per activity.

## Highlights
- Strava OAuth via `nuxt-auth-utils` (`read`, `activity:read_all` scopes) with automatic token refresh.
- Stat header compares 7 d vs 28 d mileage, easy-pace change, heart-rate drift, and recent long-run distance.
- Keyboard-driven run list (j/k/c) with inline polyline preview and one-click JSON export.
- Activity detail endpoint augments Strava data with Open‑Meteo weather, derived pacing, split breakdowns, and workout tagging.

## Setup
1. Create a Strava API app (callback: `http://localhost:3000/api/auth/strava`).
2. Add a `.env`:
   ```
   NUXT_OAUTH_STRAVA_CLIENT_ID=xxxxx
   NUXT_OAUTH_STRAVA_CLIENT_SECRET=xxxxx
   NUXT_SESSION_PASSWORD=long-random-string
   ```
3. Install deps and run the dev server:
   ```
   pnpm install
   pnpm dev
   ```

## Cloudflare
- Nitro builds a module worker (`preset: cloudflare_module`); after `pnpm build` run `npx wrangler deploy .output/server`.
- Local dev uses `nitro-cloudflare-dev`, so `pnpm dev` mirrors the worker runtime.

## Scripts
- `pnpm build` – production build.
- `pnpm preview` – preview the built app (requires live Strava creds).
