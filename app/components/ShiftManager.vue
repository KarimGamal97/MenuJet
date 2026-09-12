<template>
  <div class="w-full">
    <!-- 1. Active Shift State (Session is Open) -->
    <div
      v-if="activeSession"
      class="bg-white border border-emerald-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div class="relative flex items-center justify-center">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute"></span>
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-600 relative"></span>
        </div>

        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="font-black text-gray-900 text-base">
              {{ activeSession.shift_name || $t("shifts.general_shift") }}
            </h4>
            <span class="text-[11px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {{ $t("shifts.active_session") }}
            </span>
          </div>
          
          <div class="flex items-center gap-3 text-xs text-gray-400 font-bold mt-1 flex-wrap">
            <span>{{ $t("shifts.opened_at") }}: {{ formatTime(activeSession.opened_at) }}</span>
            <span>•</span>
            <span>{{ $t("shifts.opening_balance") }}: <strong class="text-gray-700">{{ activeSession.opening_balance }} {{ $t("currency") }}</strong></span>
            <span>•</span>
            <span>{{ $t("shifts.orders_count") }}: <strong class="text-orange-600">{{ liveStats.count }}</strong></span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Live Sales Badge -->
        <div class="bg-gray-50 px-3.5 py-2 rounded-2xl border border-gray-100 text-right">
          <p class="text-[10px] font-black text-gray-400 uppercase">{{ $t("shifts.total_sales") }}</p>
          <p class="text-sm font-black text-gray-900">{{ liveStats.totalSales }} {{ $t("currency") }}</p>
        </div>

        <button
          type="button"
          @click="openCloseModal"
          class="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 px-5 rounded-2xl shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
        >
          <span>🔒</span>
          <span>{{ $t("shifts.close_shift_btn") }}</span>
        </button>
      </div>
    </div>

    <!-- 3. Inactive Shift State (No Active Session) -->
    <div
      v-else
      class="bg-amber-50/70 border border-dashed border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
          ⏱️
        </div>
        <div>
          <h4 class="font-black text-gray-900 text-sm">
            {{ $t("shifts.no_active_session") }}
          </h4>
          <p class="text-xs text-gray-500 font-medium mt-0.5">
            {{ $t("shifts.shifts_settings_desc") }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="openStartModal"
        class="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 px-6 rounded-2xl shadow-md shadow-emerald-600/20 transition-transform active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2"
      >
        <span>⚡</span>
        <span>{{ $t("shifts.open_shift_btn") }}</span>
      </button>
    </div>

    <!-- Modal 1: Start Shift -->
    <BaseModal
      :isOpen="isOpenShiftModalOpen"
      :title="$t('shifts.open_modal_title')"
      @close="isOpenShiftModalOpen = false"
    >
      <div class="space-y-4 pt-2">
        <!-- Shift Selector -->
        <div v-if="shifts.length > 0" class="space-y-2">
          <label class="text-xs font-bold text-gray-700 block px-1">
            {{ $t("shifts.shift_select_label") }}
          </label>
          <div class="space-y-2">
            <div
              v-for="s in shifts"
              :key="s.id"
              @click="selectedShift = s"
              :class="[
                'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between',
                selectedShift?.id === s.id
                  ? 'border-orange-500 bg-orange-50/40 text-orange-950 font-black'
                  : 'border-gray-100 bg-gray-50 text-gray-700 font-bold hover:border-gray-200',
              ]"
            >
              <div class="flex items-center gap-2">
                <span>{{ s.shift_name }}</span>
                <span
                  v-if="suggestedShift?.id === s.id"
                  class="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full"
                >
                  {{ $t("shifts.shift_suggested_badge") }}
                </span>
              </div>
              <span class="text-xs text-gray-400 font-medium" dir="ltr">
                {{ s.start_time.slice(0, 5) }} - {{ s.end_time.slice(0, 5) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Opening Balance Input -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-gray-700 block px-1">
            {{ $t("shifts.opening_balance") }} ({{ $t("currency") }})
          </label>
          <input
            type="number"
            min="0"
            v-model.number="startForm.openingBalance"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-black text-gray-800 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            placeholder="0"
          />
        </div>

        <div class="pt-3">
          <BaseButton
            variant="primary"
            size="lg"
            fullWidth
            :loading="sessionLoading"
            @click="handleConfirmOpenSession"
            class="!h-13 !text-sm !font-black !bg-emerald-600 hover:!bg-emerald-700 shadow-lg shadow-emerald-100"
          >
            {{ $t("shifts.open_shift_btn") }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Modal 2: Close Shift & Z-Report -->
    <BaseModal
      :isOpen="isCloseShiftModalOpen"
      :title="$t('shifts.close_modal_title')"
      @close="isCloseShiftModalOpen = false"
    >
      <div class="space-y-4 pt-2">
        <!-- Live Audit Breakdown -->
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2.5 text-xs">
          <div class="flex justify-between items-center text-gray-500 font-bold">
            <span>{{ $t("shifts.opening_balance") }}</span>
            <span class="font-black text-gray-800">{{ activeSession?.opening_balance || 0 }} {{ $t("currency") }}</span>
          </div>

          <div class="flex justify-between items-center text-gray-500 font-bold">
            <span>{{ $t("shifts.cash_sales") }}</span>
            <span class="font-black text-emerald-600">+ {{ liveStats.cashSales }} {{ $t("currency") }}</span>
          </div>

          <div class="flex justify-between items-center text-gray-500 font-bold">
            <span>{{ $t("shifts.card_sales") }}</span>
            <span class="font-black text-blue-600">+ {{ liveStats.cardSales }} {{ $t("currency") }}</span>
          </div>

          <div class="border-t border-gray-200 pt-2 flex justify-between items-center text-sm">
            <span class="font-black text-gray-900">{{ $t("shifts.expected_cash") }}</span>
            <span class="font-black text-gray-900 text-base">
              {{ expectedCash }} {{ $t("currency") }}
            </span>
          </div>
        </div>

        <!-- Actual Cash Counted Input -->
        <div class="space-y-1.5">
          <div class="flex justify-between items-center px-1">
            <label class="text-xs font-black text-gray-800 block">
              {{ $t("shifts.closing_balance") }} ({{ $t("currency") }})
            </label>

            <!-- Difference Feedback -->
            <span
              v-if="closeForm.closingBalance !== '' && closeForm.closingBalance !== null"
              class="text-[11px] font-black px-2.5 py-0.5 rounded-full"
              :class="differenceClass"
            >
              {{ differenceText }}
            </span>
          </div>

          <input
            type="number"
            min="0"
            v-model.number="closeForm.closingBalance"
            class="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-2xl text-lg font-black text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            placeholder="0"
          />
        </div>

        <!-- Notes -->
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 block px-1">
            {{ $t("shifts.notes") }}
          </label>
          <textarea
            v-model="closeForm.notes"
            rows="2"
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            :placeholder="$t('shifts.notes_placeholder')"
          ></textarea>
        </div>

        <div class="pt-2">
          <BaseButton
            variant="primary"
            size="lg"
            fullWidth
            :loading="sessionLoading"
            @click="handleConfirmCloseSession"
            class="!h-13 !text-sm !font-black !bg-slate-900 hover:!bg-slate-800 text-white shadow-xl shadow-slate-900/10"
          >
            {{ $t("shifts.confirm_close_btn") }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { ownerId } = useAuthUser();

const {
  shifts,
  activeSession,
  sessionLoading,
  fetchShifts,
  fetchActiveSession,
  autoDetectShift,
  openSession,
  closeSession,
  getSessionLiveStats,
} = useShifts();

const emit = defineEmits(["session-changed"]);

const isOpenShiftModalOpen = ref(false);
const isCloseShiftModalOpen = ref(false);

const selectedShift = ref(null);
const suggestedShift = ref(null);

const startForm = ref({
  openingBalance: 0,
});

const closeForm = ref({
  closingBalance: "",
  notes: "",
});

const liveStats = ref({
  cashSales: 0,
  cardSales: 0,
  totalSales: 0,
  count: 0,
});

// Refresh live statistics periodically or on modal open
const refreshLiveStats = async () => {
  if (activeSession.value?.id) {
    liveStats.value = await getSessionLiveStats(activeSession.value.id);
  }
};

const expectedCash = computed(() => {
  const opening = Number(activeSession.value?.opening_balance) || 0;
  return opening + liveStats.value.cashSales;
});

const difference = computed(() => {
  if (closeForm.value.closingBalance === "" || closeForm.value.closingBalance === null) return 0;
  return Number(closeForm.value.closingBalance) - expectedCash.value;
});

const differenceText = computed(() => {
  const diff = difference.value;
  if (diff === 0) return t("shifts.balanced");
  if (diff > 0) return `+${diff} ${t("shifts.overage")}`;
  return `${diff} ${t("shifts.shortage")}`;
});

const differenceClass = computed(() => {
  const diff = difference.value;
  if (diff === 0) return "bg-emerald-100 text-emerald-800";
  if (diff > 0) return "bg-blue-100 text-blue-800";
  return "bg-red-100 text-red-800";
});

const formatTime = (isoString) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
};

const openStartModal = async () => {
  if (!ownerId.value) return;
  const list = await fetchShifts(ownerId.value);
  suggestedShift.value = autoDetectShift(list);
  selectedShift.value = suggestedShift.value;
  startForm.value.openingBalance = 0;
  isOpenShiftModalOpen.value = true;
};

const handleConfirmOpenSession = async () => {
  if (!ownerId.value) return;
  const session = await openSession({
    restaurantId: ownerId.value,
    shiftId: selectedShift.value?.id,
    shiftName: selectedShift.value?.shift_name || t("shifts.general_shift"),
    openingBalance: startForm.value.openingBalance,
  });

  if (session) {
    isOpenShiftModalOpen.value = false;
    await refreshLiveStats();
    emit("session-changed", session);
  }
};

const openCloseModal = async () => {
  await refreshLiveStats();
  closeForm.value.closingBalance = expectedCash.value;
  closeForm.value.notes = "";
  isCloseShiftModalOpen.value = true;
};

const handleConfirmCloseSession = async () => {
  if (!activeSession.value?.id) return;
  const session = await closeSession({
    sessionId: activeSession.value.id,
    closingBalance: Number(closeForm.value.closingBalance) || 0,
    notes: closeForm.value.notes,
  });

  if (session) {
    isCloseShiftModalOpen.value = false;
    emit("session-changed", null);
  }
};

// Initial load
watch(
  ownerId,
  async (newId) => {
    if (newId) {
      await fetchActiveSession(newId);
      await refreshLiveStats();
      await fetchShifts(newId);
    }
  },
  { immediate: true }
);
</script>
