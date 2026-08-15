<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    class="group px-8 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl text-lg font-bold hover:bg-gray-50 hover:border-orange-200 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
    @click="$emit('click', $event)"
  >
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
