<template>
  <aside
    :class="[
      isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
      isCollapsed ? 'w-20' : 'w-64',
    ]"
    class="fixed inset-y-0 right-0 z-50 bg-white border-l flex flex-col transition-all duration-300 ease-in-out shrink-0 md:sticky md:top-0 md:h-screen md:inset-y-auto"
  >
    <!-- Collapse Button -->
    <button
      type="button"
      @click="emit('toggleCollapse')"
      class="hidden md:flex absolute -left-3.5 top-12 bg-white border border-gray-200 hover:border-orange-300 rounded-full w-7 h-7 items-center justify-center text-gray-400 hover:text-orange-600 shadow-sm hover:shadow transition-all z-50 cursor-pointer"
    >
      <BaseIcon
        name="chevron-left"
        class="w-3.5 h-3.5 transition-transform duration-300"
        :class="isCollapsed ? 'rotate-0' : 'rotate-180'"
      />
    </button>

    <div
      class="flex flex-col h-full bg-white transition-opacity duration-200 overflow-hidden"
      :class="isCollapsed ? 'py-4 px-2.5' : 'p-4'"
    >
      <!-- Top Section -->
      <div class="shrink-0">
        <div
          @mouseenter="showItemTooltip($event, profileName)"
          @mouseleave="closeFloating"
          class="rounded-2xl mb-2.5 flex items-center justify-center transition-all duration-300 overflow-hidden"
          :class="[
            isCollapsed ? 'h-12 w-12 mx-auto' : 'p-3',
            isCollapsed && profileLogo && !logoError
              ? 'bg-white border border-gray-100 shadow-sm'
              : 'bg-gradient-to-l from-orange-600 to-orange-500 shadow-lg shadow-orange-100'
          ]"
        >
          <img
            v-if="isCollapsed && profileLogo && !logoError"
            :src="profileLogo"
            :alt="profileName"
            @error="logoError = true"
            class="w-full h-full object-cover"
          />
          <h1
            v-else
            class="font-black text-white leading-tight truncate px-2"
            :class="isCollapsed ? 'text-lg' : 'text-base'"
          >
            {{ isCollapsed && profileName ? profileName[0] : profileName }}
          </h1>
        </div>

        <!-- Trial Countdown Pill -->
        <div
          v-if="trialTimeLeft && !isSuperAdmin"
          @click="emit('openUpgrade')"
          @mouseenter="showItemTooltip($event, trialBadgeText)"
          @mouseleave="closeFloating"
          :class="[
            'cursor-pointer transition-all duration-200 active:scale-[0.98] select-none shadow-xs border',
            isCollapsed
              ? 'w-12 h-9 mx-auto mb-2.5 rounded-xl flex items-center justify-center'
              : 'w-full py-2.5 px-3 mb-2.5 rounded-2xl flex items-center justify-between',
            trialTimeLeft.expired
              ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
              : trialTimeLeft.days <= 3
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                : 'bg-orange-50/80 hover:bg-orange-100 border-orange-200/70 text-orange-800'
          ]"
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
      <nav
        @scroll="closeFloating"
        class="flex-1 overflow-y-auto min-h-0 space-y-1.5 no-scrollbar py-1"
      >
        <template v-for="link in visibleLinks" :key="link.key || link.to">
          <!-- Dropdown Group (Menu / Settings) -->
          <div v-if="link.children" class="space-y-1">
            <button
              type="button"
              @click="handleGroupClick(link, $event)"
              @mouseenter="showGroupFlyout($event, link)"
              @mouseleave="scheduleHideFloating"
              :class="[
                'flex items-center rounded-2xl transition-all font-bold overflow-hidden group cursor-pointer',
                isCollapsed
                  ? 'w-12 h-12 mx-auto justify-center'
                  : 'w-full justify-between px-3.5 py-3',
                isGroupActive(link) || (isCollapsed && floating?.type === 'group' && floating.group?.key === link.key)
                  ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-50 ring-1 ring-orange-200/60'
                  : 'hover:bg-orange-50 hover:text-orange-600 text-gray-500',
              ]"
            >
              <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'gap-3'">
                <BaseIcon
                  :name="link.icon"
                  class="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform"
                />
                <span v-if="!isCollapsed" class="whitespace-nowrap">{{ $t(link.labelKey) }}</span>
              </div>
              <BaseIcon
                v-if="!isCollapsed"
                name="chevron-down"
                class="w-4 h-4 shrink-0 transition-transform duration-200"
                :class="isDropdownOpen(link) ? 'rotate-180' : ''"
              />
            </button>

            <div
              v-if="!isCollapsed"
              class="grid transition-all duration-200 ease-out"
              :class="isDropdownOpen(link) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <div class="space-y-1 py-1">
                  <NuxtLink
                    v-for="child in link.children"
                    :key="child.to"
                    :to="child.to"
                    class="flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm transition-all group/child"
                    :class="
                      isChildActive(child)
                        ? 'bg-orange-100/70 text-orange-700 font-black'
                        : 'font-bold text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                    "
                  >
                    <span class="w-5 h-5 flex items-center justify-center shrink-0">
                      <span
                        class="rounded-full transition-all duration-200"
                        :class="
                          isChildActive(child)
                            ? 'w-2 h-2 bg-orange-600 ring-4 ring-orange-200/70'
                            : 'w-1.5 h-1.5 bg-gray-300 group-hover/child:bg-orange-400'
                        "
                      />
                    </span>
                    <span class="whitespace-nowrap">{{ $t(child.labelKey) }}</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Regular Single Link -->
          <NuxtLink
            v-else
            :to="link.to"
            @mouseenter="showItemTooltip($event, $t(link.labelKey), link.lockBadge ? $t(link.lockBadge) : '')"
            @mouseleave="closeFloating"
            @click="closeFloating"
            :class="[
              'flex items-center rounded-2xl transition-all font-bold overflow-hidden group',
              isCollapsed
                ? 'w-12 h-12 mx-auto justify-center'
                : 'w-full justify-between px-3.5 py-3',
              link.hoverClass || 'hover:bg-orange-50 hover:text-orange-600 text-gray-500',
            ]"
            :active-class="
              link.exact
                ? ''
                : link.activeClass || 'bg-orange-50 !text-orange-600 shadow-sm shadow-orange-50 ring-1 ring-orange-200/60'
            "
            :exact-active-class="
              link.exact
                ? 'bg-orange-50 !text-orange-600 shadow-sm shadow-orange-50 ring-1 ring-orange-200/60'
                : undefined
            "
          >
            <div class="flex items-center" :class="isCollapsed ? 'justify-center' : 'gap-3'">
              <BaseIcon
                :name="link.icon"
                class="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform"
              />
              <span v-if="!isCollapsed" class="whitespace-nowrap">{{ $t(link.labelKey) }}</span>
            </div>
            <span
              v-if="!isCollapsed && link.lockBadge"
              class="text-xs bg-amber-100/90 text-amber-800 px-2 py-0.5 rounded-full font-black text-[10px] border border-amber-200/80 shadow-xs shrink-0 flex items-center gap-1"
            >
              <BaseIcon name="lock" class="w-3 h-3" />
              <span>{{ $t(link.lockBadge) }}</span>
            </span>
          </NuxtLink>
        </template>
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
          type="button"
          @click="closeFloating(); emit('openLogout')"
          @mouseenter="showItemTooltip($event, $t('admin.logout'))"
          @mouseleave="closeFloating"
          :class="[
            'flex items-center text-red-700 font-bold hover:bg-red-50 transition-all overflow-hidden cursor-pointer',
            isCollapsed
              ? 'w-12 h-12 mx-auto justify-center rounded-2xl'
              : 'w-full p-3 gap-3 rounded-xl',
          ]"
        >
          <BaseIcon name="logout" class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed" class="whitespace-nowrap">{{ $t("admin.logout") }}</span>
        </button>
      </div>
    </div>

    <!-- Floating Flyout / Tooltip for Collapsed Sidebar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isCollapsed && floating?.type === 'group' && floating.group"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          :style="{ top: `${floating.top}px`, ...floating.sideStyle }"
          @mouseenter="clearHideTimer"
          @mouseleave="scheduleHideFloating"
          class="fixed z-[100] min-w-[200px] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-gray-100 p-2"
        >
          <div class="px-3 py-1.5 mb-1 border-b border-gray-100 flex items-center gap-2 text-xs font-black text-gray-400">
            <BaseIcon :name="floating.group.icon" class="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>{{ $t(floating.group.labelKey) }}</span>
          </div>
          <div class="space-y-1">
            <NuxtLink
              v-for="child in floating.group.children"
              :key="child.to"
              :to="child.to"
              @click="closeFloating"
              class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all group/flychild"
              :class="
                isChildActive(child)
                  ? 'bg-orange-100/70 text-orange-700 font-black'
                  : 'font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              "
            >
              <span class="w-4 h-4 flex items-center justify-center shrink-0">
                <span
                  class="rounded-full transition-all duration-200"
                  :class="
                    isChildActive(child)
                      ? 'w-2 h-2 bg-orange-600 ring-4 ring-orange-200/70'
                      : 'w-1.5 h-1.5 bg-gray-300 group-hover/flychild:bg-orange-400'
                  "
                />
              </span>
              <span class="whitespace-nowrap">{{ $t(child.labelKey) }}</span>
            </NuxtLink>
          </div>
        </div>

        <div
          v-else-if="isCollapsed && floating?.type === 'tooltip' && floating.label"
          :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          :style="{ top: `${floating.top}px`, ...floating.sideStyle }"
          class="fixed z-[100] -translate-y-1/2 pointer-events-none bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-1.5"
        >
          <span>{{ floating.label }}</span>
          <span
            v-if="floating.badge"
            class="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-black"
          >
            {{ floating.badge }}
          </span>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const route = useRoute()

const props = defineProps<{
  isMobileOpen: boolean
  isCollapsed: boolean
  profileName: string
  profileLogo?: string
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

const logoError = ref(false)
watch(
  () => props.profileLogo,
  () => {
    logoError.value = false
  }
)

interface SidebarChild {
  to: string
  basePath?: string
  tab?: string
  icon: string
  labelKey: string
  show: boolean
}

interface SidebarLink {
  key?: string
  to?: string
  icon: string
  labelKey: string
  exact?: boolean
  show: boolean
  hoverClass?: string
  activeClass?: string
  lockBadge?: string
  children?: SidebarChild[]
}

const VALID_SETTINGS_TABS = ['identity', 'operations', 'delivery', 'biohub']

const isOnMenuSection = (path: string) =>
  path.includes('/admin/menu') || path.includes('/admin/categories')

const isOnSettingsSection = (path: string) =>
  path.includes('/admin/settings')

const openGroups = ref<Record<string, boolean>>({
  'menu-group': isOnMenuSection(route.path),
  'settings-group': isOnSettingsSection(route.path),
})

watch(
  () => route.path,
  (path) => {
    if (isOnMenuSection(path)) {
      openGroups.value['menu-group'] = true
      openGroups.value['settings-group'] = false
    } else if (isOnSettingsSection(path)) {
      openGroups.value['settings-group'] = true
      openGroups.value['menu-group'] = false
    }
  }
)

const isDropdownOpen = (link: SidebarLink) =>
  Boolean(link.key && openGroups.value[link.key])

const isChildActive = (child: SidebarChild) => {
  if (child.basePath && child.tab) {
    if (!route.path.endsWith(child.basePath)) return false
    const rawTab = typeof route.query.tab === 'string' ? route.query.tab : ''
    const activeTab = VALID_SETTINGS_TABS.includes(rawTab) ? rawTab : 'identity'
    return activeTab === child.tab
  }
  return route.path.endsWith(child.to)
}

const isGroupActive = (link: SidebarLink) => {
  if (!link.children) return false
  return link.children.some((c) => isChildActive(c))
}

interface FloatingState {
  type: 'group' | 'tooltip'
  group?: SidebarLink
  label?: string
  badge?: string
  top: number
  sideStyle: Record<string, string>
}

const floating = ref<FloatingState | null>(null)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const closeFloating = () => {
  clearHideTimer()
  floating.value = null
}

const scheduleHideFloating = () => {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    floating.value = null
  }, 150)
}

const computeSidePosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const onRightSide = rect.left > window.innerWidth / 2
  const sideStyle: Record<string, string> = onRightSide
    ? { right: `${window.innerWidth - rect.left + 12}px` }
    : { left: `${rect.right + 12}px` }
  return { rect, sideStyle }
}

const showGroupFlyout = (event: MouseEvent, link: SidebarLink) => {
  if (!props.isCollapsed || !link.children?.length) return
  clearHideTimer()
  const target = event.currentTarget as HTMLElement | null
  if (!target) return
  const { rect, sideStyle } = computeSidePosition(target)
  const estimatedHeight = 46 + link.children.length * 42
  const maxTop = Math.max(12, window.innerHeight - estimatedHeight - 12)
  floating.value = {
    type: 'group',
    group: link,
    top: Math.min(rect.top, maxTop),
    sideStyle,
  }
}

const showItemTooltip = (event: MouseEvent, label: string, badge = '') => {
  if (!props.isCollapsed || !label) return
  clearHideTimer()
  const target = event.currentTarget as HTMLElement | null
  if (!target) return
  const { rect, sideStyle } = computeSidePosition(target)
  floating.value = {
    type: 'tooltip',
    label,
    badge,
    top: rect.top + rect.height / 2,
    sideStyle,
  }
}

watch(
  () => props.isCollapsed,
  () => closeFloating()
)

watch(
  () => route.fullPath,
  () => closeFloating()
)

onBeforeUnmount(() => clearHideTimer())

const handleGroupClick = (link: SidebarLink, event?: MouseEvent) => {
  if (props.isCollapsed) {
    if (floating.value?.type === 'group' && floating.value.group?.key === link.key) {
      closeFloating()
    } else if (event) {
      showGroupFlyout(event, link)
    }
    return
  }
  if (link.key) {
    const nextState = !openGroups.value[link.key]
    for (const k of Object.keys(openGroups.value)) {
      openGroups.value[k] = k === link.key ? nextState : false
    }
  }
}

const visibleLinks = computed<SidebarLink[]>(() => {
  const menuChildren: SidebarChild[] = [
    {
      to: '/admin/menu',
      icon: 'clipboard-list',
      labelKey: 'admin.menu_items',
      show: true,
    },
    {
      to: '/admin/categories',
      icon: 'list',
      labelKey: 'admin.menu_sections',
      show: props.canManageRestaurant,
    },
  ].filter((c) => c.show)

  const settingsChildren: SidebarChild[] = [
    {
      to: '/admin/settings?tab=identity',
      basePath: '/admin/settings',
      tab: 'identity',
      icon: 'sparkles',
      labelKey: 'admin.settings_tab_identity',
      show: true,
    },
    {
      to: '/admin/settings?tab=operations',
      basePath: '/admin/settings',
      tab: 'operations',
      icon: 'clock',
      labelKey: 'admin.settings_tab_operations',
      show: true,
    },
    {
      to: '/admin/settings?tab=delivery',
      basePath: '/admin/settings',
      tab: 'delivery',
      icon: 'wallet',
      labelKey: 'admin.settings_tab_delivery',
      show: true,
    },
    {
      to: '/admin/settings?tab=biohub',
      basePath: '/admin/settings',
      tab: 'biohub',
      icon: 'link',
      labelKey: 'admin.settings_tab_biohub',
      show: true,
    },
  ]

  const links: SidebarLink[] = [
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
    menuChildren.length > 1
      ? {
          key: 'menu-group',
          icon: 'food',
          labelKey: 'admin.menu_group',
          show: !props.isSuperAdmin,
          children: menuChildren,
        }
      : {
          to: '/admin/menu',
          icon: 'food',
          labelKey: 'admin.menu_group',
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
      key: 'settings-group',
      icon: 'settings',
      labelKey: 'admin.settings',
      show: props.canManageRestaurant && !props.isSuperAdmin,
      children: settingsChildren,
    },
    {
      to: '/admin/users',
      icon: 'users',
      labelKey: 'admin.users',
      show: props.canManageRestaurant && !props.isSuperAdmin,
      hoverClass: 'hover:bg-purple-50 hover:text-purple-600 text-gray-500',
      activeClass: 'bg-purple-50 !text-purple-600 shadow-sm ring-1 ring-purple-200/60',
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
