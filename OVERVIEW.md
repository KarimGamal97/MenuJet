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
- Progressive rendering: first 5 items per category, then 4 more per scroll step via `IntersectionObserver`.
- Cart persistence (`app/composables/useCart.ts`):
  - Saved per restaurant in `localStorage` (`menujet_cart_<slug>`) with a 2-hour TTL.
  - After refresh, the cart is restored, a "Continue Order" toast is shown, and the Bio Hub welcome page is skipped.
  - "Clear Cart" button in `CartModal.vue`.
- WhatsApp phone normalization in `buildWhatsAppUrl` (Arabic numerals, `00`, Egyptian `01x` → `201x`).

### Admin dashboard
- Sidebar (`app/components/admin/layout/AdminSidebar.vue`):
  - "Menu" dropdown (Items, Menu Categories) and "Settings" dropdown (4 sections).
  - Sub-items use dots instead of icons, aligned with parent links.
  - Collapsed mode: centered icons, flyout menus for groups, tooltips for single links.
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

## Pending / To verify
- Test cart persistence on a real phone (add items → refresh → cart restored, toast shown, menu opens directly).

## Notes
- DB changes needing manual SQL (already provided): `profiles.additional_phones jsonb`, `check_menu_items_limit()` trigger update.
- Shell is Windows PowerShell 5.1 — chain commands with `; if ($LASTEXITCODE -eq 0) { ... }` instead of `&&`.
