# Final Pre-Submission Audit and Improvement Plan

This plan outlines the final steps to ensure Sylen is production-ready, perfectly accessible, secure, and clean.

## Phase 1: Accessibility Fixes
- **Page Regions:** The `Navbar` component is currently wrapped only in a `<nav>` tag. I will wrap it in a `<header>` tag so that the entire page correctly uses `<header>`, `<main>`, and `<footer>` landmarks, resolving the "No page regions" warning.
- **Language Attribute:** The `layout.tsx` file already correctly specifies `<html lang="en">`. I will ensure no other missing language metadata exists.

## Phase 2: Security Hardening (CSP)
The current CSP in `next.config.ts` uses `'unsafe-eval'` which triggers the B+ grade.
- **Proposed CSP Update:**
  - Remove `'unsafe-eval'` from `script-src` (Next.js production builds do not require it).
  - Add `object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests;` to satisfy HTTP Observatory's strict security checklist.
  - Keep `'unsafe-inline'` as it's required for Next.js hydration and Framer Motion animations unless we do a massive nonce-based middleware refactor (which risks breaking the PWA and static pages).

## Phase 3 & 4: Mobile UX & Quality Review
- Run a grep check for any hardcoded widths (e.g. `w-[500px]`) that might cause mobile overflow.
- Ensure all forms, buttons, and inputs have sufficient touch targets (`min-h-[44px]`).
- The "Dashboard opens at top" bug was fixed previously via `window.scrollTo`, but I will double-check all flows.

## Phase 5: Code Cleanup
- Run a project-wide search for `console.log` (excluding necessary server-side logs in API routes).
- Run the ESLint auto-fixer and check for any unused variables or imports.

## Phase 6: Validation
- Execute `npm run lint && npm run test && npm run build` to guarantee a 100% clean production build.
