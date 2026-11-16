<template>
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <BaseIcon name="clock" class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <label class="text-sm font-bold text-gray-800 block">{{ $t("shifts.shifts_settings_title") }}</label>
          <p class="text-xs text-gray-400 font-medium">{{ $t("shifts.shifts_settings_desc") }}</p>
        </div>
      </div>
      <span class="text-[10px] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-black">
        {{ shifts.length }} {{ $t("shifts.shift_name") }}
      </span>
    </div>

    <!-- Add New Shift Inputs -->
    <div class="flex flex-col sm:flex-row gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <div class="flex-1 w-full">
        <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.shift_name") }}</label>
        <BaseInput v-model="newShift.shift_name" :placeholder="$t('shifts.general_shift')" />
      </div>
      <div class="w-full sm:w-36">
        <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.start_time") }}</label>
        <input
          type="time"
          v-model="newShift.start_time"
          class="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>
      <div class="w-full sm:w-36">
        <label class="text-[10px] font-bold text-gray-400 px-1 mb-1 block">{{ $t("shifts.end_time") }}</label>
        <input
          type="time"
          v-model="newShift.end_time"
          class="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>
      <BaseButton
        variant="primary"
        icon="plus"
        @click="emit('add')"
        class="!w-14 !h-12 !p-0 shrink-0 mb-1"
      />
    </div>

    <!-- Defined Shifts Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      <div
        v-for="s in shifts"
        :key="s.id"
        class="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-xs flex items-center justify-between group hover:border-orange-200 transition-all relative"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <BaseIcon name="clock" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-black text-sm text-gray-800">{{ s.shift_name }}</p>
            <p class="text-xs font-bold text-gray-400 mt-0.5" dir="ltr">
              {{ s.start_time.slice(0, 5) }} - {{ s.end_time.slice(0, 5) }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="emit('remove', s.id)"
          class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <BaseIcon name="trash" class="w-4 h-4" />
        </button>
      </div>

      <div v-if="shifts.length === 0" class="col-span-full py-8 flex flex-col items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-xs bg-gray-50/30">
        <BaseIcon name="clock" class="w-8 h-8 mb-2 opacity-30" />
        {{ $t("shifts.no_shifts_defined") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ShiftItem {
  id: string | number
  shift_name: string
  start_time: string
  end_time: string
}

interface NewShiftForm {
  shift_name: string
  start_time: string
  end_time: string
}

defineProps<{
  shifts: ShiftItem[]
  newShift: NewShiftForm
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string | number]
}>()
</script>
