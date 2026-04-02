<template>
  <Transition
    enter-active-class="transition duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    enter-from-class="transform translate-y-24 scale-90 opacity-0"
    enter-to-class="transform translate-y-0 scale-100 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 scale-100 opacity-100"
    leave-to-class="transform translate-y-24 scale-90 opacity-0"
  >
    <div
      v-if="cartCount > 0"
      class="fixed bottom-8 left-4 right-4 z-[100] md:max-w-md md:mx-auto"
    >
      <button
        @click="emit('openCart')"
        class="w-full bg-orange-600 text-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group overflow-hidden"
      >
        <!-- Item count and total -->
        <div class="flex items-center gap-3 relative z-10">
          <div
            class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl relative shrink-0"
          >
            <BaseIcon name="cart" class="w-6 h-6" />
            <span
              class="absolute -top-1 -right-1 bg-white text-orange-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
            >
              {{ cartCount }}
            </span>
          </div>
          <div class="text-right">
            <p
              class="text-[9px] font-black uppercase tracking-[0.2em] opacity-80"
            >
              {{ $t("cart.total") }}
            </p>
            <p class="text-lg font-black leading-none">
              {{ totalPrice }} {{ $t("currency") }}
            </p>
          </div>
        </div>

        <!-- View Order -->
        <div
          class="flex items-center gap-2 font-black text-sm pr-2 relative z-10"
        >
          {{ $t("cart.title") }}
          <BaseIcon
            name="arrow"
            class="w-5 h-5 transition-transform group-hover:-translate-x-1"
            :class="!isRTL ? 'rotate-180 group-hover:translate-x-1' : ''"
          />
        </div>

        <!-- Animated Background Glow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        ></div>
      </button>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps(["whatsappNumber"]);
const emit = defineEmits(["openCart"]);
const { totalPrice, cartCount } = useCart();
const { locale } = useI18n();

const isRTL = computed(() => locale.value === "ar");
</script>
