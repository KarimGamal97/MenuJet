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
      <!-- <LandingDemoVideo /> -->
      <LandingPricing />
      <LandingFAQs />
      <LandingContactForm />
    </main>

    <LandingTheFooter />
  </div>
</template>

<script setup>
</script>

<style>
body {
  font-family: 'Cairo', 'Tajawal', sans-serif;
}
.text-teal-900 { color: #004d4d; }
</style>