<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[300] flex items-center justify-center p-4 brand-theme-scope"
      :style="{ '--p-color': primaryColor }"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="emit('close')"
      />

      <div
        class="relative bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl z-10 overflow-hidden"
      >
        <div class="bg-gray-900 px-6 pt-10 pb-12 text-center">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
              <BaseIcon name="check" class="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 class="text-white font-black text-xl">
            {{ $t("cart.cashier_title") }}
          </h2>
          <p class="text-gray-400 text-sm mt-2">
            {{ $t("cart.cashier_subtitle") }}
          </p>
        </div>

        <div class="flex justify-center -mt-6">
          <div class="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-xl border-4 border-white">
            #{{ orderNumber }}
          </div>
        </div>

        <div class="px-6 py-8">
          <button
            @click="emit('close')"
            class="w-full py-4 bg-orange-100 text-orange-600 rounded-2xl font-black hover:bg-orange-200 transition-all"
          >
            {{ $t("cart.close") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  primaryColor: string
  orderNumber: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
