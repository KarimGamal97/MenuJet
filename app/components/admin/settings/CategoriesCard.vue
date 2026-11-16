<template>
  <div class="md:col-span-2 pt-4">
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex items-center gap-3">
        <label class="text-sm font-bold text-gray-700">
          {{ $t("admin.menu_sections") }}
        </label>
        <span class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-black">
          {{ categories.length }} / {{ maxCategories === -1 ? '∞' : maxCategories }}
          {{ $t("admin.sections_count") }}
        </span>
      </div>

      <button
        v-if="isCategoryLimitReached || isPlanFree"
        type="button"
        @click="emit('openUpgrade')"
        class="inline-flex items-center gap-1 text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
      >
        <BaseIcon name="bolt" class="w-3.5 h-3.5" />
        {{ $t("plans.upgrade_btn") }}
      </button>
    </div>

    <div class="flex gap-3 items-end">
      <BaseInput
        :modelValue="newCategory"
        @update:modelValue="emit('update:newCategory', $event)"
        @keyup.enter="emit('add')"
        :placeholder="$t('admin.add_category_placeholder')"
      />
      <BaseButton
        variant="primary"
        icon="plus"
        @click="emit('add')"
        class="!w-14 !h-14 !p-0 !grow-0 shrink-0"
      />
    </div>

    <div class="flex flex-wrap gap-2 mt-6 min-h-[50px] p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
      <template v-if="loading">
        <div
          v-for="i in 5"
          :key="i"
          class="w-20 h-10 bg-gray-200 animate-pulse rounded-xl"
        ></div>
      </template>

      <template v-else>
        <div
          v-for="(cat, index) in categories"
          :key="index"
          class="bg-white text-gray-700 px-3 py-2 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm animate-in zoom-in duration-200 group hover:border-orange-200 overflow-hidden"
        >
          <!-- Move Controls -->
          <div class="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1">
            <button
              @click="emit('move', index, -1)"
              v-if="index > 0"
              class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
            >
              <BaseIcon name="arrow-up" class="w-2.5 h-2.5" />
            </button>
            <button
              @click="emit('move', index, 1)"
              v-if="index < categories.length - 1"
              class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
            >
              <BaseIcon name="arrow-down" class="w-2.5 h-2.5" />
            </button>
          </div>

          <!-- Item Content -->
          <div class="flex items-center gap-2">
            <template v-if="editingIndex === index">
              <input
                :value="editingName"
                @input="emit('update:editingName', ($event.target as HTMLInputElement).value)"
                @blur="emit('saveEdit', index)"
                @keyup.enter="emit('saveEdit', index)"
                @keyup.esc="emit('cancelEdit')"
                class="bg-gray-50 border-none outline-none font-bold text-sm w-24 px-1 rounded text-center"
                autofocus
              />
            </template>
            <template v-else>
              <span
                class="font-bold text-sm cursor-pointer hover:text-orange-600 transition-colors"
                @click="emit('startEdit', index)"
              >
                {{ cat }}
              </span>
            </template>
          </div>

          <!-- Delete Button -->
          <button
            @click="emit('remove', index)"
            class="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center p-1"
          >
            <BaseIcon name="close" class="w-3.5 h-3.5" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: string[]
  maxCategories: number
  isCategoryLimitReached: boolean
  isPlanFree: boolean
  loading: boolean
  newCategory: string
  editingIndex: number | null
  editingName: string
}>()

const emit = defineEmits<{
  'update:newCategory': [value: string]
  'update:editingName': [value: string]
  add: []
  move: [index: number, direction: number]
  startEdit: [index: number]
  saveEdit: [index: number]
  cancelEdit: []
  remove: [index: number]
  openUpgrade: []
}>()
</script>
