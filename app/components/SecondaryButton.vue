<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="group px-8 py-3 bg-white dark:bg-slate-800/90 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
    @click="$emit('click', $event)"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="href"
    :href="href"
    class="group px-8 py-3 bg-white dark:bg-slate-800/90 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
    @click="$emit('click', $event)"
  >
    <slot />
  </a>

  <button
    v-else
    class="group px-8 py-3 bg-white dark:bg-slate-800/90 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-orange-200 dark:hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  }
})

defineEmits(['click'])
</script>
