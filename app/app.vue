<script setup>
const { locale } = useI18n();
const route = useRoute();
const { isDark } = useTheme();

const SITE_URL = "https://getmenujet.com";

const localeDir = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

const isPrivateRoute = computed(() =>
  /^\/(en\/|ar\/)?(admin|platform|login|confirm)(\/|$)/.test(route.path)
);

const normalizedPublicPath = computed(() => {
  let p = route.path || "/";
  if (p === "/en" || p === "/en/" || p === "/ar" || p === "/ar/") return "/";
  p = p.replace(/^\/(en|ar)(?=\/)/, "");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
});

const canonicalUrl = computed(() => {
  const basePath = normalizedPublicPath.value === "/" ? "" : normalizedPublicPath.value;
  return locale.value === "en" ? `${SITE_URL}/en${basePath}` : `${SITE_URL}${basePath || "/"}`;
});

const arAlternateUrl = computed(() => {
  const basePath = normalizedPublicPath.value === "/" ? "" : normalizedPublicPath.value;
  return `${SITE_URL}${basePath || "/"}`;
});

const enAlternateUrl = computed(() => {
  const basePath = normalizedPublicPath.value === "/" ? "" : normalizedPublicPath.value;
  return `${SITE_URL}/en${basePath}`;
});

useHead(() => ({
  htmlAttrs: {
    dir: localeDir.value,
    lang: locale.value === "ar" ? "ar" : "en",
    class: { dark: isDark.value },
  },
  link: isPrivateRoute.value
    ? []
    : [
        { rel: "canonical", href: canonicalUrl.value },
        { rel: "alternate", hreflang: "ar", href: arAlternateUrl.value },
        { rel: "alternate", hreflang: "ar-EG", href: arAlternateUrl.value },
        { rel: "alternate", hreflang: "ar-SA", href: arAlternateUrl.value },
        { rel: "alternate", hreflang: "en", href: enAlternateUrl.value },
        { rel: "alternate", hreflang: "x-default", href: arAlternateUrl.value },
      ],
  meta: [
    { property: "og:site_name", content: "MenuJet" },
    { property: "og:locale", content: locale.value === "ar" ? "ar_EG" : "en_US" },
  ],
}));

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
