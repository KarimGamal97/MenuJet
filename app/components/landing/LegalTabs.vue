<template>
  <div class="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 select-none no-scrollbar">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap"
      :class="isCurrentRoute(tab.path)
        ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-600/20'
        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'"
    >
      <span v-if="isCurrentRoute(tab.path)" class="w-2 h-2 rounded-full bg-white shrink-0"></span>
      <span>{{ $t(tab.labelKey) }}</span>
    </NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()

const tabs = [
  { path: '/privacy', labelKey: 'landing_footer.link_privacy' },
  { path: '/terms', labelKey: 'landing_footer.link_terms' },
  { path: '/refund', labelKey: 'landing_footer.link_refund' },
  { path: '/faq', labelKey: 'landing_footer.link_faq' },
]

const isCurrentRoute = (targetPath) => {
  if (!targetPath) return false
  const current = route.path.replace(/\/+$/, '') || '/'
  const target = targetPath.replace(/\/+$/, '') || '/'

  const cleanCurrent = current.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'
  const cleanTarget = target.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'

  return cleanCurrent === cleanTarget
}
</script>
