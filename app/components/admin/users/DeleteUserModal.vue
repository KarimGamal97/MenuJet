<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        @click="emit('close')"
      />
      <div
        class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
      >
        <div
          class="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl mb-4 font-black"
        >
          <BaseIcon name="alert" class="w-6 h-6 text-red-500" />
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-2">
          {{ $t("admin.users_page.delete_user_title") }}
        </h2>
        <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
          {{ $t("admin.users_page.delete_user_confirm_pt1") }}
          <span class="font-bold text-gray-900">{{ displayName }}</span>
          {{ $t("admin.users_page.delete_user_confirm_pt2") }}
        </p>

        <div class="flex gap-3">
          <button
            @click="emit('close')"
            class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="emit('confirm')"
            :disabled="deleting"
            class="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {{ deleting ? $t("admin.users_page.deleting") : $t("admin.users_page.delete_account") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  deleting: boolean;
  displayName: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>
