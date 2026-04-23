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
    "@vite-pwa/nuxt", // تم إضافة موديل الـ PWA هنا
  ],

  // إعدادات الـ PWA الجديدة
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Neorder Smart Menu",
      short_name: "Neorder",
      description: "The Next Generation of Ordering",
      theme_color: "#ffffff",
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
