# Debug Session: dashboard-stuck-routes

Status: OPEN

## User Symptoms
- Dashboard stays on "Loading dashboard..."
- Some routes/buttons are not working
- App can get stuck on processing/loading states

## Hypotheses
1. Dashboard data fetch fails and loading state never resets.
2. Auth/profile bootstrap fails and route waits forever.
3. One or more linked routes do not exist or crash during render.
4. Supabase table/policy mismatch causes route-level runtime errors.
5. Navigation or redirect flow loops and prevents steady state.

## Plan
1. Inspect route tree and current loaders/components.
2. Add runtime instrumentation only.
3. Reproduce with dev server and collect evidence.
4. Apply minimal fix based on evidence.
5. Verify with diagnostics and route walkthrough.

## Findings
- Confirmed: the header linked to `/pricing`, but no `pricing` route exists.
- Confirmed: dashboard loading depended on auth bootstrap, and auth bootstrap awaited profile loading before the app could fully settle.
- Confirmed: background removal had no timeout, so a slow webhook could leave the UI stuck on `Processing...`.
- Confirmed: several CTA buttons had no meaningful destination and appeared broken.

## Fixes Applied
- `src/lib/auth.tsx`: stop blocking auth readiness on profile fetch; profile now loads asynchronously after session state is set.
- `src/routes/dashboard.tsx`: only show the loading screen while auth is actually loading; if no user, let redirect happen without a permanent spinner.
- `src/routes/index.tsx`: add a 45s timeout to background removal, compute generation time from a local request timestamp, and render credits from fetched profile state with a loading label.
- `src/components/site/Header.tsx`: replace broken `Pricing` route link with an anchor to the pricing section on home.
- `src/routes/index.tsx`: wire dead CTA buttons to real destinations and add `id="pricing"` for anchor navigation.
- `src/components/HistoryGrid.tsx`: relax callback typings so dashboard/history props are compatible.

## Verification
- VS Code diagnostics for edited files are clean.
- User/browser verification is still required for final runtime confirmation.
