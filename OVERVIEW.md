# MenuJet — Project Overview

Status snapshot of the project. Update this file whenever a task completes, progresses, or changes the project state.

**Stack:** Nuxt 4 (Nitro, Vite), Vue 3, Tailwind CSS, `@nuxtjs/i18n` (ar / en), Supabase, Pinia, vue-sonner.

---

## Done

### Customer menu (`app/pages/menu/[slug].vue`)
- Sticky search bar and category pills; bottom bar hides on scroll down and reappears on scroll up.
- Category pills: removed the check icon (white pill is the active state); text vertically centered for iOS Safari.
- "Open now" status badge aligned with its dot (`MenuHeader.vue`, `RestaurantInfoModal.vue`).
- Image skeleton + fade-in while item images load (`MenuItemCard.vue`, `ItemDetailModal.vue`).
- Splash screen (`SplashScreen.vue`) with animated QR -> scan laser -> MenuJet logo reveal, scoped to `app/layouts/admin.vue` during initial profile load (`adminSplashPending`) instead of blocking public routes.
- Progressive rendering: first 5 items per category, then 4 more per scroll step via `IntersectionObserver`.
- Cart persistence (`app/composables/useCart.ts`):
  - Saved per restaurant in `localStorage` (`menujet_cart_<slug>`) with a 2-hour TTL.
  - After refresh, the cart is restored, a "Continue Order" toast is shown, and the Bio Hub welcome page is skipped.
  - "Clear Cart" button in `CartModal.vue`.
- WhatsApp phone normalization and safe `api.whatsapp.com/send` URL encoding in `buildWhatsAppUrl`, plus BMP emojis in WhatsApp order messages (`useCartCheckout.ts`).

### Admin dashboard
- Admin layout (`app/layouts/admin.vue`): matched `<main>` `dir` to active locale so the page scrollbar sits at the outer edge instead of next to the sidebar.
- Sidebar (`app/components/admin/layout/AdminSidebar.vue`):
  - "Menu" dropdown (Items, Menu Categories) and "Settings" dropdown (4 sections) with accordion behavior.
  - Sub-items use dots instead of icons, aligned with parent links; `no-scrollbar` on `<nav>` so only the outer page scrollbar shows.
  - Collapsed mode: centered icons, restaurant logo badge (with first-letter fallback), flyout menus for groups, tooltips for single links.
- Settings (`app/pages/admin/settings.vue`): split into 4 sections driven by `?tab=` (identity, operations, delivery, biohub), each with its own subtitle; sticky save bar.
- Categories page (`app/pages/admin/categories.vue`) with instant auto-save.
- Additional contact numbers (Pro only) in Bio Hub settings, shown in `RestaurantHub.vue` and `RestaurantInfoModal.vue`.

### Plans & platform
- Active trial unlocks all Pro features (`isActiveTrialCheck`).
- Item caps: 100 (Basic), 130 (Pro / Trial); over the cap shows a WhatsApp contact modal.
- Platform WhatsApp renewal reminders include plan price and InstaPay / Vodafone Cash details.

### Landing & auth
- Split hero with interactive phone showcase, demo video section, footer call button.
- Login page footer: "Powered by MenuJet".

### Data
- Super Mario new menu: SQL migration script provided to the client (run manually in Supabase SQL Editor).

---

### SEO & indexing
- `public/robots.txt` blocks `/admin`, `/platform`, `/login`, `/confirm`, `/api/` and points to `/sitemap.xml`.
- `server/routes/sitemap.xml.ts`: dynamic multilingual XML sitemap covering public pages + active non-expired `/menu/<slug>` pages with `hreflang` (`ar`, `ar-EG`, `ar-SA`, `en`, `x-default`).
- `app/app.vue`: global dynamic `canonical` and `hreflang` links on public routes; `noindex, nofollow` applied on `admin.vue`, `login.vue`, `confirm.vue`, and expired/missing menus.
- `app/pages/index.vue`: bilingual `useSeoMeta` + `SoftwareApplication` and `Organization` JSON-LD schemas.
- `app/components/landing/StatsSection.vue`: removed `lazy: true` from `useFetch` so SSR HTML renders real numbers instead of `0`, while preserving client-side scroll animation.
- `app/pages/menu/[slug].vue`, `MenuHeader.vue`, `MenuFooter.vue`: removed `lazy: true` for real SSR menu rendering, added `<h1>` + dynamic SEO meta + `Restaurant`/`Menu` JSON-LD + `Powered by MenuJet` backlink on every menu.

### Performance & accessibility
- Removed `<SplashScreen>` from `app/app.vue` and `menuSplashPending` from `app/pages/menu/[slug].vue` so public `/` and `/menu/[slug]` no longer block FCP/LCP behind the splash overlay.
- `app/components/landing/DemoVideo.vue`: switched `<video>` to `preload="none"` so the demo MP4 is deferred until playback.
- `app/components/landing/TheNavbar.vue` & `i18n/locales/*.json`: added localized `aria-label` (`nav.toggle_menu`) and `aria-expanded` to the mobile menu button.
- `app/components/landing/HeroShowcase.vue` & `Pricing.vue`: improved WCAG text contrast on placeholder search text, 11px price text (`text-orange-700`), and `/ month` / `/ year` labels (`text-slate-600 dark:text-slate-300`).
- `app/components/landing/Clients.vue` & `TheFooter.vue`: added larger clickable hit area around slider indicator dots and replaced skipped `<h4>` footer column headings with `<p>`.

### Pending / To verify
- Run `npm run build` locally to confirm full production build passes after performance/accessibility changes.
- Compress `app/assets/bgo.png` (~1.77 MB) to WebP and optimize Google Fonts loading in `nuxt.config.ts`.
- Generate/upload dedicated `1200x630` `public/og.png` social preview image (currently referencing `/pwa-512x512.png`).
- Optional Phase 3 SEO landing pages (`/qr-menu`, `/whatsapp-ordering`, `/cashier-system`, `/cafes`, `/restaurants`, `/blog/*`) — requires adding those routes to `supabase.redirectOptions.exclude` in `nuxt.config.ts`.
- Test cart persistence on a real phone (add items → refresh → cart restored, toast shown, menu opens directly).

## Notes
- DB changes needing manual SQL (already provided): `profiles.additional_phones jsonb`, `check_menu_items_limit()` trigger update.
- Shell is Windows PowerShell 5.1 — chain commands with `; if ($LASTEXITCODE -eq 0) { ... }` instead of `&&`.
