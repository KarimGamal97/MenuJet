<template>
  <aside
    :class="[
      isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
      isCollapsed ? 'w-20 md:w-24' : 'w-64',
    ]"
    class="fixed inset-y-0 right-0 z-50 bg-white border-l flex flex-col transition-all duration-300 ease-in-out shrink-0 md:sticky md:top-0 md:h-screen md:inset-y-auto"
  >
    <!-- Collapse Button -->
    <button
      @click="emit('toggleCollapse')"
      class="flex absolute -left-3 top-12 bg-white border border-gray-200 rounded-full w-7 h-7 items-center justify-center text-gray-400 hover:text-orange-600 shadow-sm z-50"
    >
      <span
        class="text-[10px] transition-transform duration-300"
        :class="isCollapsed ? 'rotate-0' : 'rotate-180'"
      >
        ❯
      </span>
    </button>

    <div
      class="flex flex-col h-full bg-white transition-opacity duration-200 overflow-hidden"
      :class="isCollapsed ? 'p-3' : 'p-4'"
    >
      <!-- Top Section -->
      <div class="shrink-0">
        <div
          class="bg-gradient-to-l from-orange-600 to-orange-500 rounded-2xl mb-2.5 flex items-center justify-center shadow-lg shadow-orange-100 transition-all duration-300 overflow-hidden"
          :class="isCollapsed ? 'h-14 w-14' : 'p-3'"
        >
          <h1
            class="font-black text-white leading-tight truncate px-2"
            :class="isCollapsed ? 'text-xl' : 'text-base'"
          >
            {{ isCollapsed && profileName ? profileName[0] : profileName }}
          </h1>
        </div>

        <!-- Trial Countdown Pill -->
        <div
          v-if="trialTimeLeft && !isSuperAdmin"
          @click="emit('openUpgrade')"
          :class="[
            'cursor-pointer transition-all duration-200 active:scale-[0.98] select-none shadow-xs border',
            isCollapsed
              ? 'w-14 h-9 mx-auto mb-2.5 rounded-xl flex items-center justify-center'
              : 'w-full py-2.5 px-3 mb-2.5 rounded-2xl flex items-center justify-between',
            trialTimeLeft.expired
              ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
              : trialTimeLeft.days <= 3
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                : 'bg-orange-50/80 hover:bg-orange-100 border-orange-200/70 text-orange-800'
          ]"
          :title="isCollapsed ? trialBadgeText : ''"
        >
          <template v-if="isCollapsed">
            <BaseIcon :name="trialTimeLeft.expired ? 'alert' : 'clock'" class="w-4 h-4" />
          </template>
          <template v-else>
            <div class="flex items-center gap-1.5 min-w-0">
              <BaseIcon
                :name="trialTimeLeft.expired ? 'alert' : 'clock'"
                class="w-4 h-4 shrink-0"
                :class="{ 'animate-pulse': trialTimeLeft.days <= 3 }"
              />
              <span class="text-xs font-bold text-gray-600 truncate">
                {{ isTrial ? $t('plans.trial_period_label') : 'متبقي على التجديد' }}
              </span>
            </div>
            <span class="text-xs font-black shrink-0">{{ trialBadgeText }}</span>
          </template>
        </div>

        <hr class="mb-2.5 opacity-50" />
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto min-h-0 space-y-2.5 custom-scrollbar py-1 pe-0.5">
        <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center justify-between px-3.5 py-3.5 rounded-2xl transition-all font-bold overflow-hidden group"
          :class="link.hoverClass || 'hover:bg-orange-50 text-gray-500'"
          :active-class="link.activeClass || 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-50'"
          :exact-active-class="link.exact ? 'bg-orange-50 text-orange-600' : undefined"
        >
          <div class="flex items-center gap-3">
            <BaseIcon
              :name="link.icon"
              class="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{ $t(link.labelKey) }}</span>
          </div>
          <span
            v-if="!isCollapsed && link.lockBadge"
            class="text-xs bg-amber-100/90 text-amber-800 px-2 py-0.5 rounded-full font-black text-[10px] border border-amber-200/80 shadow-xs shrink-0 flex items-center gap-1"
          >
            <BaseIcon name="lock" class="w-3 h-3" />
            <span>{{ $t(link.lockBadge) }}</span>
          </span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="pt-4 border-t mt-2 space-y-2 shrink-0">
        <!-- Unified Plan Card -->
        <div
          v-if="!isCollapsed && !isSuperAdmin"
          class="mb-2 p-3.5 rounded-2xl border space-y-2.5"
          :class="
            isPro
              ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-300/80'
              : isBasic
                ? 'bg-gradient-to-br from-slate-900/5 via-slate-800/5 to-slate-900/10 border-slate-200'
                : 'bg-gradient-to-br from-orange-50 to-amber-50/70 border-orange-200/80'
          "
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
        >
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500">{{ $t('plans.current_plan_label') }}:</span>
              <span class="inline-flex items-center gap-1 font-black text-slate-900">
                {{ $t(isTrial ? 'plans.free_trial_badge' : isPro ? 'plans.pro_short_name' : isBasic ? 'plans.basic_short_name' : 'plans.free_short_name') }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500">{{ $t('plans.status_label') }}:</span>
              <span class="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full">
                {{ $t('plans.status_active') }}
              </span>
            </div>
          </div>

          <button
            v-if="!isPro || isTrial"
            type="button"
            @click="emit('openUpgrade')"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-95 text-center cursor-pointer block"
          >
            {{ $t('plans.upgrade_pro_full') }}
          </button>
        </div>

        <button
          @click="emit('openLogout')"
          class="flex items-center gap-3 w-full p-3 text-red-700 font-bold hover:bg-red-50 rounded-xl transition-all overflow-hidden cursor-pointer"
          :title="isCollapsed ? $t('admin.logout') : ''"
        >
          <BaseIcon name="logout" class="w-5 h-5 shrink-0" />
          <span v-show="!isCollapsed" class="whitespace-nowrap">{{ $t("admin.logout") }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isMobileOpen: boolean
  isCollapsed: boolean
  profileName: string
  userRole: string
  isSuperAdmin: boolean
  canManageRestaurant: boolean
  isTrial: boolean
  trialTimeLeft: { expired: boolean; days: number } | null
  trialBadgeText: string
  currentPlan: Record<string, any>
  isFree: boolean
  isBasic: boolean
  isPro: boolean
  canAllowAnalytics: boolean
  canAllowUsers: boolean
}>()

const emit = defineEmits<{
  toggleCollapse: []
  openUpgrade: []
  openLogout: []
}>()

const visibleLinks = computed(() => {
  const links = [
    {
      to: '/admin',
      icon: 'home',
      labelKey: 'admin.dashboard',
      exact: true,
      show: true,
    },
    {
      to: '/platform',
      icon: 'crown',
      labelKey: 'admin.platform',
      exact: true,
      show: props.isSuperAdmin,
    },
    {
      to: '/admin/menu',
      icon: 'food',
      labelKey: 'admin.menu',
      show: !props.isSuperAdmin,
    },
    {
      to: '/admin/orders',
      icon: 'cart',
      labelKey: 'admin.orders',
      show: !props.isSuperAdmin,
    },
    {
      to: '/admin/sales',
      icon: 'chart',
      labelKey: 'admin.sales',
      show: props.canManageRestaurant && !props.isSuperAdmin,
      lockBadge: !props.canAllowAnalytics ? 'plans.basic_badge_short' : '',
    },
    {
      to: '/admin/settings',
      icon: 'settings',
      labelKey: 'admin.settings',
      show: props.canManageRestaurant && !props.isSuperAdmin,
    },
    {
      to: '/admin/users',
      icon: 'users',
      labelKey: 'admin.users',
      show: props.canManageRestaurant && !props.isSuperAdmin,
      hoverClass: 'hover:bg-purple-50 text-gray-500',
      activeClass: 'bg-purple-50 text-purple-600 shadow-sm',
      lockBadge: !props.canAllowUsers ? 'plans.pro_badge_short' : '',
    },
  ]
  return links.filter((l) => l.show)
})
</script>

<style scoped>
@media (min-width: 768px) {
  aside {
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
