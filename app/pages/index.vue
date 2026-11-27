<template>
  <div
    class="landing-page bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <LandingTheNavbar />
    <main>
      <LandingHeroSection />
      <LandingClients />
      <LandingStatsSection />
      <LandingFeatures />
      <LandingDemoVideo />
      <LandingPricing />
      <LandingFAQs />
      <LandingContactForm />
    </main>
    <LandingTheFooter />
    <LandingFloatingActions />
  </div>
</template>

<script setup>
import { SOCIAL_LINKS } from "~/utils/helpers";

const { t, locale } = useI18n();

const seoTitle = computed(() => t("seo.home_title"));
const seoDesc = computed(() => t("seo.home_desc"));

const pageUrl = computed(() =>
  locale.value === "ar" ? "https://getmenujet.com/" : "https://getmenujet.com/en"
);

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
  ogType: "website",
  ogUrl: pageUrl,
  ogImage: "https://getmenujet.com/pwa-512x512.png",
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDesc,
  twitterImage: "https://getmenujet.com/pwa-512x512.png",
});

useHead(() => ({
  script: [
    {
      key: "ld-software",
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "MenuJet",
        url: "https://getmenujet.com",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: locale.value === "ar" ? "ar" : "en",
        description: seoDesc.value,
        offers: [
          {
            "@type": "Offer",
            name: t("seo.basic_plan_name"),
            price: "250",
            priceCurrency: "EGP",
          },
          {
            "@type": "Offer",
            name: t("seo.pro_plan_name"),
            price: "500",
            priceCurrency: "EGP",
          },
        ],
      }),
    },
    {
      key: "ld-org",
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MenuJet",
        url: "https://getmenujet.com",
        logo: "https://getmenujet.com/pwa-512x512.png",
        sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
      }),
    },
  ],
}));
</script>

<style>
body {
  font-family: 'Cairo', 'Tajawal', sans-serif;
}
.text-teal-900 { color: #004d4d; }
</style>