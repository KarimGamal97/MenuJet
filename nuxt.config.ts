export default defineNuxtConfig({
  css: ["~/assets/main.css"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2026-03-27",
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: "autoUpdate",
    injectRegister: "auto",
    manifest: {
      name: "MenuJet Smart Menu",
      short_name: "MenuJet",
      description: "The Next Generation Of Smart Menus",
      theme_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      screenshots: [
        {
          src: "/screenshots/mobile-preview.png",
          sizes: "750x1334",
          type: "image/png",
          label: "واجهة منيو الموبايل الذكية",
        },
        {
          src: "/screenshots/desktop-preview.png",
          sizes: "1920x1080",
          type: "image/png",
          form_factor: "wide",
          label: "لوحة تحكم منيو جت",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },

  i18n: {
    locales: [
      { code: "ar", iso: "ar-EG", name: "Arabic", file: "ar.json", dir: "rtl" },
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
        dir: "ltr",
      },
    ],
    langDir: "locales",
    defaultLocale: "ar",
    strategy: "prefix_except_default",
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/menu/*", "/"],
    },
  },
});
