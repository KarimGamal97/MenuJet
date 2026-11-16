<template>
  <div class="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-black text-gray-900 flex items-center gap-2">
          {{ $t("admin.top_items_title") || "الأصناف الأكثر طلباً" }}
          <span class="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg">
            Top 5
          </span>
        </h3>
        <span class="text-xs font-bold text-gray-400">
          {{ topDishesList.length }} أصناف
        </span>
      </div>
      <p class="text-xs text-gray-400 font-medium mt-1">
        الوجبات الأكثر تكراراً في طلبات العملاء
      </p>
    </div>

    <div
      v-if="topDishesList.length === 0"
      class="flex-1 flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="w-16 h-16 rounded-3xl bg-gray-50 text-gray-300 flex items-center justify-center mb-3">
        <BaseIcon name="food" class="w-8 h-8" />
      </div>
      <p class="text-sm font-bold text-gray-400">
        {{ $t("admin.no_chart_data") || "لا توجد طلبات مسجلة خلال هذه الفترة" }}
      </p>
    </div>

    <div v-show="topDishesList.length > 0" class="flex-1 flex flex-col justify-center">
      <div class="space-y-1 divide-y divide-gray-50">
        <div
          v-for="(item, idx) in topDishesList"
          :key="item.name"
          class="py-3 flex items-center justify-between text-xs gap-3"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0',
                idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                idx === 1 ? 'bg-gray-200 text-gray-800' :
                idx === 2 ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-600'
              ]"
            >
              {{ idx + 1 }}
            </span>
            <span class="font-bold text-gray-800 truncate text-sm" :title="item.name">
              {{ item.name }}
            </span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="w-20 text-center font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl text-xs shrink-0">
              {{ item.count }} طلب
            </span>
            <span
              v-if="item.totalRevenue"
              class="w-24 text-start text-gray-400 font-bold text-xs shrink-0"
            >
              ({{ item.totalRevenue.toLocaleString() }} ج.م)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  topDishesList: Array<{ name: string; count: number; totalRevenue: number }>
}>()
</script>
