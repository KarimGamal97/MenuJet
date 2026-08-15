<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    class="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl text-lg font-bold shadow-xl shadow-orange-500/30 hover:-translate-y-1 hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden cursor-pointer inline-flex justify-center items-center gap-2"
    @click="$emit('click', $event)"
  >
    <div class="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -ml-4 w-1/4 pointer-events-none"></div>
    <slot />
  </component>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
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

const componentType = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})
</script>
