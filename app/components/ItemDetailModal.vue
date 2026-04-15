<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
        dir="rtl"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="$emit('close')"
        />

        <!-- Modal Sheet -->
        <div
          class="relative w-full sm:max-w-sm bg-white rounded-t-[2.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <!-- Item Image / Header -->
          <div class="relative h-52 bg-gray-100 overflow-hidden">
            <img
              v-if="item.image"
              :src="item.image"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-50"
            >
              <BaseIcon name="photo" class="w-16 h-16 text-gray-200" />
            </div>
            <!-- Close Button -->
            <button
              @click="$emit('close')"
              class="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
            >
              <BaseIcon name="close" class="w-4 h-4" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-3">
            <!-- Name + Description -->
            <div class="pb-1">
              <h2 class="text-xl font-black text-gray-800">{{ item.name }}</h2>
              <p
                v-if="item.description"
                class="text-gray-400 text-sm mt-1 leading-relaxed"
              >
                {{ item.description }}
              </p>
            </div>

            <!-- Quantity -->
            <div
              class="flex items-center justify-between bg-gray-50 rounded-2xl p-3"
            >
              <span class="text-sm font-bold text-gray-500">{{
                $t("admin.quantity")
              }}</span>
              <div class="flex items-center gap-4">
                <button
                  @click="decrease"
                  class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors active:scale-95 shadow-sm"
                >
                  −
                </button>
                <span
                  class="text-lg font-black text-gray-800 w-5 text-center"
                  >{{ qty }}</span
                >
                <button
                  @click="qty++"
                  class="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white hover:bg-orange-700 transition-colors active:scale-95 shadow-md shadow-orange-200"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Size Selector -->
            <div
              v-if="pricingType === 'size'"
              class="bg-gray-50 rounded-2xl p-3"
            >
              <p class="text-sm font-bold text-gray-500 mb-2">
                {{ $t("admin.size") }}
              </p>
              <div class="flex gap-2">
                <button
                  v-for="s in availableSizes"
                  :key="s"
                  @click="selectedSize = s"
                  :class="[
                    'flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 active:scale-95',
                    selectedSize === s
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-500',
                  ]"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Count Selector (for 'count' type, e.g. 10P / 15P / 25P) -->
            <div
              v-else-if="pricingType === 'count'"
              class="bg-gray-50 rounded-2xl p-3"
            >
              <p class="text-sm font-bold text-gray-500 mb-2">
                {{ $t("admin.quantity") }}
              </p>
              <div class="flex gap-2">
                <button
                  v-for="entry in countEntries"
                  :key="entry.label"
                  @click="selectedCount = entry.label"
                  :class="[
                    'flex-1 py-2.5 rounded-xl font-black text-xs transition-all border-2 active:scale-95',
                    selectedCount === entry.label
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-500',
                  ]"
                >
                  {{ entry.label }} {{ $t("admin.piece") }}
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div class="bg-gray-50 rounded-2xl p-3">
              <button 
                @click="showNotes = !showNotes"
                class="flex items-center justify-between w-full focus:outline-none"
              >
                <p class="text-sm font-bold text-gray-500">
                  {{ $t('menu.notes') }}
                </p>
                <div class="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-colors">
                  <BaseIcon 
                    name="chevron-down" 
                    class="w-4 h-4 transition-transform duration-300"
                    :class="{ 'rotate-180': showNotes }"
                  />
                </div>
              </button>
              
              <div v-show="showNotes" class="mt-3">
                <textarea
                  v-model="notes"
                  :placeholder="$t('menu.notes_placeholder')"
                  maxlength="50"
                  class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                  rows="2"
                ></textarea>
                <div class="text-left mt-1 px-1">
                  <span 
                    class="text-[10px] font-bold transition-colors" 
                    :class="notes.length >= 50 ? 'text-red-500' : 'text-gray-400'"
                  >
                    {{ notes.length }} / 50
                  </span>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div
              class="bg-orange-50 rounded-2xl p-3 border border-orange-100 flex items-center justify-between"
            >
              <p class="text-sm font-bold text-orange-400">
                {{ $t("admin.total") }}
              </p>
              <p class="text-xl font-black text-orange-600">
                {{ total }} {{ $t("admin.currency") }}
              </p>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="handleAdd"
              class="w-full py-4 bg-orange-600 text-white font-black rounded-2xl text-sm hover:bg-orange-700 active:scale-[0.98] transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              <BaseIcon name="plus" class="w-4 h-4" />
              {{ $t("admin.add_to_cart") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  item: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "added"]);
const { addToCart } = useCart();
const qty = ref(1);
const selectedSize = ref("sm");
const selectedCount = ref(null);
const notes = ref("");
const showNotes = ref(false);

// Detect pricing type from stored prices
const pricingType = computed(() => {
  const p = props.item.prices;
  if (!p || Object.keys(p).length === 0) return "fixed";
  if (Object.keys(p).some((k) => ["sm", "md", "lg"].includes(k))) return "size";
  if ("fixed" in p) return "fixed";
  return "count";
});

// Only show sizes that have a price
const availableSizes = computed(() =>
  ["sm", "md", "lg"].filter((s) => props.item.prices?.[s]),
);

// Parse count entries from prices object
const countEntries = computed(() => {
  if (pricingType.value !== "count") return [];
  return Object.entries(props.item.prices || {}).map(([label, price]) => ({
    label,
    price: Number(price),
  }));
});

// Reset state every time modal opens
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      qty.value = 1;
      notes.value = "";
      showNotes.value = false;
      if (pricingType.value === "size") {
        selectedSize.value = availableSizes.value[0] || "sm";
      } else if (pricingType.value === "count") {
        selectedCount.value = countEntries.value[0]?.label || null;
      }
    }
  },
);

const currentPrice = computed(() => {
  if (pricingType.value === "size") {
    return Number(
      props.item.prices?.[selectedSize.value] || props.item.price || 0,
    );
  }
  if (pricingType.value === "count") {
    const entry = countEntries.value.find(
      (e) => e.label === selectedCount.value,
    );
    return entry ? entry.price : 0;
  }
  return Number(props.item.prices?.fixed || props.item.price || 0);
});

const total = computed(() => (currentPrice.value * qty.value).toFixed(0));

const decrease = () => {
  if (qty.value > 1) qty.value--;
};

const handleAdd = () => {
  const itemInfo = { ...props.item, price: currentPrice.value, size: undefined };
  if (pricingType.value === "size") itemInfo.size = selectedSize.value;
  if (pricingType.value === "count")
    itemInfo.size = selectedCount.value + " قطعة";
  if (notes.value.trim()) itemInfo.notes = notes.value.trim();
  
  for (let i = 0; i < qty.value; i++) addToCart(itemInfo);
  emit("added");
  emit("close");
};
</script>

<style scoped>
.modal-enter-from .modal-leave-to {
  opacity: 0;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(40px);
  opacity: 0;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.2s ease;
}
</style>
