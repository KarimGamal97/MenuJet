<template>
  <section
    id="stats"
    ref="sectionRef"
    class="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:border-b dark:border-slate-800 text-white relative overflow-hidden transition-colors duration-300"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div
      class="absolute -top-24 start-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-24 end-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-black mb-4"
        >
          <span>{{ $t("stats.badge") }}</span>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.45] mb-4"
        >
          {{ $t("stats.title_part1") }}
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300"
          >
            {{ $t("stats.title_part2") }}
          </span>
        </h2>
        <p
          class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          {{ $t("stats.subtitle") }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div
          v-for="card in statCards"
          :key="card.key"
          class="group p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-white/[0.08] transition-all duration-300 text-center flex flex-col items-center"
        >
          <div
            class="w-14 h-14 mb-5 rounded-2xl bg-orange-500/15 border border-orange-400/25 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300"
          >
            <BaseIcon :name="card.icon" class="w-7 h-7" />
          </div>

          <div
            class="flex items-baseline justify-center gap-1.5 mb-2 flex-wrap"
          >
            <span
              dir="ltr"
              class="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-200 tabular-nums"
            >
              {{ card.value }}
            </span>
            <span
              v-if="card.unit"
              class="text-sm font-black text-orange-400"
            >
              {{ card.unit }}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-extrabold text-white mb-1.5">
            {{ card.title }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
            {{ card.desc }}
          </p>
        </div>
      </div>

      <div class="mt-10 sm:mt-12 text-center">
        <a
          href="#pricing"
          @click.prevent="scrollToPricing"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-200"
        >
          <span>{{ $t("stats.cta") }}</span>
          <BaseIcon
            :name="locale === 'ar' ? 'chevron-left' : 'chevron-right'"
            class="w-4 h-4"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface PublicStatsResponse {
  itemsCount: number;
  totalSales: number;
}

interface StatCard {
  key: string;
  icon: string;
  value: string;
  unit?: string;
  title: string;
  desc: string;
}

const ANIMATION_DURATION_MS = 1100;
const SETUP_MINUTES = 5;

const { t, locale } = useI18n();

const { data: stats } = useFetch<PublicStatsResponse>("/api/public/stats", {
  lazy: true,
  default: () => ({ itemsCount: 0, totalSales: 0 }),
});

const sectionRef = ref<HTMLElement | null>(null);
const displaySales = ref(stats.value?.totalSales ?? 0);
const displayItems = ref(stats.value?.itemsCount ?? 0);
const displaySetup = ref(SETUP_MINUTES);
const isInView = ref(false);

let observer: IntersectionObserver | null = null;
let frameId: number | null = null;

function formatNumber(val: number): string {
  return Math.max(0, Math.round(val)).toLocaleString("en-US");
}

const statCards = computed<StatCard[]>(() => [
  {
    key: "sales",
    icon: "chart",
    value: `+${formatNumber(displaySales.value)}`,
    unit: t("stats.sales.unit"),
    title: t("stats.sales.title"),
    desc: t("stats.sales.desc"),
  },
  {
    key: "items",
    icon: "sparkles",
    value: `+${formatNumber(displayItems.value)}`,
    title: t("stats.items.title"),
    desc: t("stats.items.desc"),
  },
  {
    key: "commission",
    icon: "check-circle",
    value: t("stats.commission.value"),
    title: t("stats.commission.title"),
    desc: t("stats.commission.desc"),
  },
  {
    key: "setup",
    icon: "bolt",
    value: String(Math.round(displaySetup.value)),
    unit: t("stats.setup.unit"),
    title: t("stats.setup.title"),
    desc: t("stats.setup.desc"),
  },
]);

function animateToTargets(fromZero = false) {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targetSales = stats.value?.totalSales ?? 0;
  const targetItems = stats.value?.itemsCount ?? 0;

  if (prefersReducedMotion) {
    displaySales.value = targetSales;
    displayItems.value = targetItems;
    displaySetup.value = SETUP_MINUTES;
    return;
  }

  const startSales = fromZero ? 0 : displaySales.value;
  const startItems = fromZero ? 0 : displayItems.value;
  const startSetup = fromZero ? 0 : displaySetup.value;
  const start = performance.now();

  const step = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / ANIMATION_DURATION_MS);
    const eased = 1 - Math.pow(1 - progress, 3);

    displaySales.value = startSales + (targetSales - startSales) * eased;
    displayItems.value = startItems + (targetItems - startItems) * eased;
    displaySetup.value = startSetup + (SETUP_MINUTES - startSetup) * eased;

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      displaySales.value = targetSales;
      displayItems.value = targetItems;
      displaySetup.value = SETUP_MINUTES;
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(step);
}

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
}

watch(
  stats,
  (next) => {
    if (!next) return;
    if (isInView.value) {
      animateToTargets(false);
    } else {
      displaySales.value = next.totalSales;
      displayItems.value = next.itemsCount;
    }
  },
  { deep: true },
);

onMounted(() => {
  if (typeof IntersectionObserver === "undefined") {
    isInView.value = true;
    animateToTargets(true);
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        isInView.value = true;
        animateToTargets(true);
        observer?.disconnect();
        observer = null;
      }
    },
    { threshold: 0.2 },
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
});
</script>
