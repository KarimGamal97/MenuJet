export default defineNuxtConfig({
  css: ["~/assets/main.css"],
  app: {
    head: {
      link: [
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
  ],
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
