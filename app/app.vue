<script setup>
const { locale } = useI18n();

const localeDir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

useHead({
  htmlAttrs: {
    dir: localeDir,
    lang: locale,
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly
    ><Toaster
      :dir="localeDir"
      position="top-right"
      richColors
      closeButton
      :toastOptions="{
        style: {
          borderRadius: '1rem',
          padding: '0.875rem 1.25rem',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: localeDir === 'rtl' ? 'right' : 'left',
        },
      }"
  /></ClientOnly>
</template>
