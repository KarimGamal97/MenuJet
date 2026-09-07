<template>
  <div class="landing-page" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LandingTheNavbar />
    <main>
      <LandingHeroSection />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingDemoVideo />
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