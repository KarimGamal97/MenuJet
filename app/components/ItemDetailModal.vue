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
            <!-- Size Badge -->
            <span
              v-if="item.size"
              class="absolute top-4 right-4 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-xl shadow-lg shadow-orange-200 tracking-wider"
            >
              {{ item.size }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-3">
            <!-- Name + Description -->
            <div class="pb-1">
              <h2 class="text-xl font-black text-gray-800">{{ item.name }}</h2>
              <p v-if="item.description" class="text-gray-400 text-sm mt-1 leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <!-- Quantity -->
            <div class="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
              <span class="text-sm font-bold text-gray-500">الكمية</span>
              <div class="flex items-center gap-4">
                <button
                  @click="decrease"
                  class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors active:scale-95 shadow-sm"
                >
                  −
                </button>
                <span class="text-lg font-black text-gray-800 w-5 text-center">{{ qty }}</span>
                <button
                  @click="qty++"
                  class="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white hover:bg-orange-700 transition-colors active:scale-95 shadow-md shadow-orange-200"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Size Selector -->
            <div class="bg-gray-50 rounded-2xl p-3">
              <p class="text-sm font-bold text-gray-500 mb-2">الحجم</p>
              <div class="flex gap-2">
                <button
                  v-for="s in ['sm', 'md', 'lg']" :key="s"
                  @click="selectedSize = s"
                  :class="[
                    'flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 active:scale-95',
                    selectedSize === s
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                      : 'bg-white text-gray-400 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                  ]"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-orange-50 rounded-2xl p-3 border border-orange-100 flex items-center justify-between">
              <p class="text-sm font-bold text-orange-400">الإجمالي</p>
              <p class="text-xl font-black text-orange-600">
                {{ total }} {{ $t('admin.currency') }}
              </p>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="handleAdd"
              class="w-full py-4 bg-orange-600 text-white font-black rounded-2xl text-sm hover:bg-orange-700 active:scale-[0.98] transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              <BaseIcon name="plus" class="w-4 h-4" />
              أضف للسلة
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
  item: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'added']);

const { addToCart } = useCart();
const qty = ref(1);
const selectedSize = ref('md');

// Reset quantity and size every time modal opens
watch(() => props.isOpen, (val) => {
  if (val) {
    qty.value = 1;
    selectedSize.value = props.item.size || 'md';
  }
});

const currentPrice = computed(() => {
  if (props.item.prices && props.item.prices[selectedSize.value]) {
    return Number(props.item.prices[selectedSize.value]);
  }
  return Number(props.item.price || 0);
});

const total = computed(() => {
  return (currentPrice.value * qty.value).toFixed(0);
});

const decrease = () => {
  if (qty.value > 1) qty.value--;
};

const handleAdd = () => {
  for (let i = 0; i < qty.value; i++) {
    addToCart({ ...props.item, size: selectedSize.value, price: currentPrice.value });
  }
  emit('added');
  emit('close');
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
</style>
