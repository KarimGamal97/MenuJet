<script setup>
defineProps(["restaurant", "locale"]);
const { setLocale, t } = useI18n();

// Get current user session
const user = useSupabaseUser();

const getLocaleTxt = (item, field) =>
  item[`${field}_${useI18n().locale.value}`] || item[`${field}_ar`] || "";
</script>

<template>
  <header class="bg-orange-600 text-white shadow-lg w-full">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="space-y-1">
        <span
          class="text-orange-200 text-xs font-bold tracking-widest uppercase"
        >
          {{ $t("welcome") }}
        </span>
        <h1 class="text-3xl font-black">
          {{ getLocaleTxt(restaurant, "business_name") }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="user"
          to="/admin"
          class="bg-white text-orange-600 px-4 py-2 rounded-2xl text-xs font-bold hover:bg-orange-50 transition-colors"
        >
          لوحة التحكم
        </NuxtLink>

        <button
          @click="setLocale(locale === 'ar' ? 'en' : 'ar')"
          class="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold border border-white/30 active:scale-95 transition-all"
        >
          {{ locale === "ar" ? "English" : "عربي" }}
        </button>
      </div>
    </div>
  </header>
</template>
