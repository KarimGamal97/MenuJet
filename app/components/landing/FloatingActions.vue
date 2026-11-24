<template>
  <div
    class="fixed bottom-5 left-5 z-40 flex flex-col items-center gap-3"
    dir="ltr"
  >
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-90"
    >
      <button
        v-if="showScrollTop"
        type="button"
        @click="scrollToTop"
        :title="$t('floating.back_to_top')"
        :aria-label="$t('floating.back_to_top')"
        class="w-11 h-11 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-lg hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white hover:border-orange-500 dark:hover:border-orange-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
      >
        <BaseIcon name="arrow-up" class="w-5 h-5 stroke-[2.5]" />
      </button>
    </Transition>

    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      :title="$t('floating.whatsapp_label')"
      :aria-label="$t('floating.whatsapp_label')"
      class="floating-whatsapp group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <span
        class="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none"
      ></span>
      <BaseIcon name="whatsapp" solid class="w-7 h-7 relative z-10" />
    </a>
  </div>
</template>

<script setup lang="ts">
const SCROLL_THRESHOLD_PX = 350;

const { t } = useI18n();
const showScrollTop = ref(false);

const whatsappUrl = computed(() =>
  getSupportWhatsAppUrl(t("floating.whatsapp_message")),
);

function handleScroll() {
  if (typeof window === "undefined") return;
  showScrollTop.value = window.scrollY > SCROLL_THRESHOLD_PX;
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
@keyframes whatsappFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.floating-whatsapp {
  animation: whatsappFloat 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .floating-whatsapp {
    animation: none;
  }
}
</style>
