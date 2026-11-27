<template>
  <Transition name="splash-screen">
    <div
      v-if="show"
      id="splash"
      role="status"
      aria-label="MenuJet Loading"
      class="splash-root"
      dir="ltr"
    >
      <!-- Soft Floating Particles -->
      <div class="particles" aria-hidden="true">
        <span
          v-for="particle in particles"
          :key="particle.id"
          :style="{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }"
        />
      </div>

      <!-- Stage: 11x11 QR -> Scan Laser -> Logo Reveal -->
      <div class="stage" :class="{ 'is-logo': logoShow }">
        <div class="qr" :class="{ out: qrOut }" aria-hidden="true">
          <div
            v-for="cell in qrCells"
            :key="cell.idx"
            class="cell"
            :class="{
              in: cell.on && inCells[cell.idx] && !flashingRows[cell.row],
              settled: cell.on && flashingRows[cell.row],
              flash: cell.on && flashingRows[cell.row],
            }"
            :style="!cell.on ? { visibility: 'hidden' } : undefined"
          />
        </div>

        <div class="scan" :class="{ go: scanGo }" aria-hidden="true" />

        <div class="logo" :class="{ show: logoShow }">
          <img
            v-if="!logoError"
            src="~/assets/navbar-logo.svg"
            alt="MenuJet"
            @error="logoError = true"
          />
          <div v-else class="wordmark">MenuJet</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="bar">
        <b :style="{ width: barFilled ? '100%' : '0%' }" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show?: boolean;
  }>(),
  {
    show: true,
  }
);

const emit = defineEmits<{
  complete: [];
}>();

const GRID_SIZE = 11;

interface QrCell {
  idx: number;
  row: number;
  col: number;
  on: boolean;
  activeOrder: number;
}

const isFinderBlock = (r: number, c: number) =>
  (r < 3 && c < 3) ||
  (r < 3 && c >= GRID_SIZE - 3) ||
  (r >= GRID_SIZE - 3 && c < 3);

// Deterministic QR matrix so SSR HTML matches client hydration cleanly
const qrCells: QrCell[] = [];
let activeCount = 0;

for (let r = 0; r < GRID_SIZE; r++) {
  for (let c = 0; c < GRID_SIZE; c++) {
    const idx = r * GRID_SIZE + c;
    const on = isFinderBlock(r, c)
      ? true
      : (r * 17 + c * 31 + (r + 1) * (c + 2) * 7) % 10 >= 4;
    qrCells.push({
      idx,
      row: r,
      col: c,
      on,
      activeOrder: on ? activeCount++ : -1,
    });
  }
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 98}%`,
  top: `${50 + ((i * 23 + 7) % 50)}%`,
  delay: `${((i * 13) % 60) / 10}s`,
  duration: `${4 + ((i * 19) % 40) / 10}s`,
}));

const inCells = ref<boolean[]>(Array(GRID_SIZE * GRID_SIZE).fill(false));
const flashingRows = ref<boolean[]>(Array(GRID_SIZE).fill(false));
const scanGo = ref(false);
const qrOut = ref(false);
const logoShow = ref(false);
const barFilled = ref(false);
const logoError = ref(false);

const timers: Array<ReturnType<typeof setTimeout>> = [];

const clearAllTimers = () => {
  while (timers.length) {
    const id = timers.pop();
    if (id !== undefined) clearTimeout(id);
  }
};

const runSequence = () => {
  clearAllTimers();
  inCells.value = Array(GRID_SIZE * GRID_SIZE).fill(false);
  flashingRows.value = Array(GRID_SIZE).fill(false);
  scanGo.value = false;
  qrOut.value = false;
  logoShow.value = false;
  barFilled.value = false;

  // Start progress bar fill on next paint
  requestAnimationFrame(() => {
    timers.push(
      setTimeout(() => {
        barFilled.value = true;
      }, 20)
    );
  });

  // 1) Dots appear one by one in reading order
  for (const cell of qrCells) {
    if (cell.on) {
      timers.push(
        setTimeout(() => {
          inCells.value[cell.idx] = true;
        }, cell.activeOrder * 22)
      );
    }
  }

  // 2) Scan laser sweeps down and flashes each row
  timers.push(
    setTimeout(() => {
      scanGo.value = true;
      const total = 1000;
      for (let r = 0; r < GRID_SIZE; r++) {
        timers.push(
          setTimeout(() => {
            flashingRows.value[r] = true;
          }, (r / GRID_SIZE) * total * 0.9)
        );
      }
    }, 2100)
  );

  // 3) QR morphs out -> MenuJet logo reveals
  timers.push(
    setTimeout(() => {
      qrOut.value = true;
      logoShow.value = true;
    }, 3250)
  );

  // 4) Sequence finished
  timers.push(
    setTimeout(() => {
      emit("complete");
    }, 5000)
  );
};

onMounted(() => {
  if (props.show) {
    runSequence();
  }
});

watch(
  () => props.show,
  (val) => {
    if (val) {
      runSequence();
    } else {
      clearAllTimers();
    }
  }
);

onBeforeUnmount(() => {
  clearAllTimers();
});
</script>

<style scoped>
.splash-root {
  --bg: #020617;
  --orange: #ff7a1a;
  --orange-soft: #ffb066;

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background:
    radial-gradient(circle at 50% 45%, rgba(255, 122, 26, 0.22), transparent 55%),
    var(--bg);
  overflow: hidden;
  user-select: none;
}

.splash-screen-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.splash-screen-leave-to {
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}

/* Soft floating particles */
.particles span {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--orange);
  opacity: 0;
  filter: blur(1px);
  animation: splash-float 6s linear infinite;
}

@keyframes splash-float {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-220px);
    opacity: 0;
  }
}

/* Stage: QR -> Logo */
.stage {
  position: relative;
  width: 180px;
  height: 180px;
  display: grid;
  place-items: center;
  transition: height 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.stage.is-logo {
  height: 108px;
}

.qr {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  gap: 4px;
  transition: transform 0.7s cubic-bezier(0.6, 0, 0.2, 1), opacity 0.6s ease,
    filter 0.6s ease;
}

.qr.out {
  transform: scale(0.4) rotate(8deg);
  opacity: 0;
  filter: blur(8px);
}

.cell {
  border-radius: 3px;
  background: var(--orange);
  transform: scale(0);
  opacity: 0;
}

.cell.in {
  animation: splash-pop 0.35s cubic-bezier(0.3, 1.6, 0.5, 1) forwards;
}

.cell.settled {
  transform: scale(1);
  opacity: 0.85;
}

.cell.flash {
  animation: splash-cell-flash 0.45s ease;
}

@keyframes splash-pop {
  to {
    transform: scale(1);
    opacity: 0.85;
  }
}

@keyframes splash-cell-flash {
  0%,
  100% {
    background: var(--orange);
    box-shadow: none;
  }
  50% {
    background: #fff;
    box-shadow: 0 0 14px 3px var(--orange);
  }
}

/* Scan line */
.scan {
  position: absolute;
  left: -14px;
  right: -14px;
  height: 3px;
  top: 0;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--orange),
    #fff,
    var(--orange),
    transparent
  );
  box-shadow: 0 0 22px 6px rgba(255, 122, 26, 0.7);
  opacity: 0;
}

.scan.go {
  animation: splash-scan 1s ease-in-out forwards;
}

@keyframes splash-scan {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: calc(100% - 3px);
    opacity: 0;
  }
}

/* Logo reveal */
.logo {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transform: scale(0.6);
  filter: blur(10px);
  transition: all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.logo.show {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  animation: splash-logo-glow 2s ease-in-out infinite 0.8s;
}

.logo img {
  width: 260px;
  max-width: 70vw;
  display: block;
}

.wordmark {
  color: var(--orange);
  font-size: 44px;
  font-weight: 700;
  letter-spacing: 1px;
}

@keyframes splash-logo-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 6px rgba(255, 122, 26, 0.35));
  }
  50% {
    filter: drop-shadow(0 0 22px rgba(255, 122, 26, 0.8));
  }
}

/* Progress bar */
.bar {
  width: 200px;
  height: 3px;
  border-radius: 3px;
  background: #0f172a;
  overflow: hidden;
}

.bar b {
  display: block;
  height: 100%;
  width: 0;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--orange), var(--orange-soft));
  box-shadow: 0 0 10px var(--orange);
  transition: width 4.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .splash-root *,
  .splash-screen-leave-active {
    animation-duration: 0.01s !important;
    transition-duration: 0.01s !important;
  }
}
</style>
