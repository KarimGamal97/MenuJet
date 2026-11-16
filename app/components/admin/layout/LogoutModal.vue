<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-6"
    >
      <div
        class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
        @click="emit('close')"
      ></div>
      <div class="bg-white rounded-[2rem] p-8 max-w-sm w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <BaseIcon name="logout" class="w-8 h-8" />
          </div>
        </div>
        <h3 class="text-xl font-black text-gray-900 mb-2 text-center">
          {{ $t("admin.logout_confirm_title") }}
        </h3>
        <p class="text-gray-500 text-sm mb-8 text-center leading-relaxed">
          {{ $t("admin.dashboard_confirm_msg") }}
        </p>

        <div class="flex gap-3">
          <button
            @click="emit('close')"
            class="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="emit('confirm')"
            class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-transform active:scale-95"
          >
            {{ $t("admin.confirm") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>
