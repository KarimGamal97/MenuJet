<script setup>
const { locale } = useI18n();
const { isDark } = useTheme();

const localeDir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

useHead({
  htmlAttrs: {
    dir: localeDir,
    lang: locale,
    class: computed(() => ({ dark: isDark.value })),
  },
});

onMounted(() => {
  document.documentElement.classList.toggle("dark", isDark.value);
  document.documentElement.style.colorScheme = isDark.value ? "dark" : "light";
});
</script>

<template>
  <!-- <VitePwaManifest /> -->
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
