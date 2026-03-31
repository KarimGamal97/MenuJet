<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden font-sans">
    <!-- Backdrop for mobile -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300"
      @click="isMobileOpen = false"
    ></div>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
          @click="showLogoutModal = false"
        ></div>
        <div
          class="bg-white rounded-[2rem] p-8 max-w-sm w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        >
          <div class="text-3xl mb-4 text-center">👋</div>
          <h3 class="text-xl font-black text-gray-900 mb-2 text-center">
            {{ $t("admin.logout_confirm_title") }}
          </h3>
          <p class="text-gray-500 text-sm mb-8 text-center leading-relaxed">
            {{ $t("admin.dashboard_confirm_msg") }}
          </p>

          <div class="flex gap-3">
            <button
              @click="showLogoutModal = false"
              class="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              {{ $t("admin.cancel") }}
            </button>
            <button
              @click="handleLogout"
              class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-transform active:scale-95"
            >
              {{ $t("admin.confirm") }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Sidebar Aside -->
    <aside
      :class="[
        isMobileOpen ? 'translate-x-0' : 'translate-x-[256px] md:translate-x-0',
        isCollapsed ? 'md:w-24' : 'md:w-64',
      ]"
      class="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l flex flex-col transition-all duration-300 ease-in-out shrink-0 md:sticky md:top-0 md:h-screen md:inset-y-auto"
    >
      <!-- Collapse Button (Desktop Only) -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="hidden md:flex absolute -left-3 top-12 bg-white border border-gray-200 rounded-full w-7 h-7 items-center justify-center text-gray-400 hover:text-orange-600 shadow-sm z-50"
      >
        <span
          class="text-[10px] transition-transform duration-300"
          :class="isCollapsed ? 'rotate-0' : 'rotate-180'"
        >
          ❯
        </span>
      </button>

      <!-- Sidebar Container -->
      <div
        class="flex flex-col h-full bg-white transition-opacity duration-200"
        :class="isCollapsed ? 'p-3' : 'p-6'"
      >
        <!-- Header: Logo / Restaurant Name -->
        <div
          class="bg-gradient-to-l from-orange-600 to-orange-500 rounded-2xl mb-8 flex items-center justify-center shrink-0 shadow-lg shadow-orange-100 transition-all duration-300 overflow-hidden"
          :class="isCollapsed ? 'h-14 w-14' : 'p-4'"
        >
          <h1
            class="font-black text-white leading-tight truncate px-2"
            :class="isCollapsed ? 'text-xl' : 'text-lg'"
          >
            {{
              isCollapsed && profile?.business_name
                ? profile.business_name[0]
                : profile?.business_name || "MenuJet"
            }}
          </h1>
        </div>

        <hr class="mb-4 opacity-50" />

        <!-- Nav Links -->
        <nav class="flex-grow space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
            exact-active-class="bg-orange-50 text-orange-600"
          >
            <span
              class="text-xl shrink-0 group-hover:scale-110 transition-transform"
              >🏠</span
            >
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.dashboard")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/menu"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <span
              class="text-xl shrink-0 group-hover:scale-110 transition-transform"
              >🍴</span
            >
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.menu")
            }}</span>
          </NuxtLink>

          <div v-if="profile?.slug">
            <a
              :href="`/menu/${profile.slug}`"
              target="_blank"
              class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
              :title="isCollapsed ? $t('admin.view_menu') : ''"
            >
              <span
                class="text-xl shrink-0 group-hover:scale-110 transition-transform"
                >🌐</span
              >
              <span
                v-show="!isCollapsed"
                class="whitespace-nowrap underline-offset-4 decoration-orange-300"
              >
                {{ $t("admin.view_menu") }}
              </span>
            </a>
          </div>

          <NuxtLink
            to="/admin/settings"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <span
              class="text-xl shrink-0 group-hover:scale-110 transition-transform"
              >⚙️</span
            >
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.settings")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <span
              class="text-xl shrink-0 group-hover:scale-110 transition-transform"
              >📦</span
            >
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.orders")
            }}</span>
          </NuxtLink>

          <!-- Language Switcher Dropdown -->
          <div class="relative">
            <button
              @click="isLangDropdownOpen = !isLangDropdownOpen"
              class="flex items-center gap-3 w-full p-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all overflow-hidden"
              :class="
                isLangDropdownOpen ? 'bg-gray-50 ring-1 ring-gray-100' : ''
              "
            >
              <span class="text-xl shrink-0">🌍</span>
              <span
                v-show="!isCollapsed"
                class="whitespace-nowrap flex-grow text-right"
              >
                {{ locale === "ar" ? "العربية" : "English" }}
              </span>
              <span
                v-show="!isCollapsed"
                class="text-[10px] text-gray-300 group-hover:text-gray-400"
              >
                {{ isLangDropdownOpen ? "▲" : "▼" }}
              </span>
            </button>

            <!-- Language Dropdown Menu -->
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="isLangDropdownOpen"
                class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-[60] overflow-hidden"
              >
                <div class="p-2 space-y-1">
                  <button
                    v-for="item in locales"
                    :key="item.code"
                    @click="changeLanguage(item.code)"
                    class="flex items-center gap-3 w-full p-3 rounded-xl transition-all font-bold"
                    :class="
                      locale === item.code
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    "
                  >
                    <span class="text-lg">{{
                      item.code === "ar" ? "🇪🇬" : "🇺🇸"
                    }}</span>
                    <span>{{ item.name }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="mt-auto pt-6 space-y-2 border-t border-gray-100">
          <button
            @click="showLogoutModal = true"
            class="flex items-center gap-3 w-full p-4 text-red-700 font-bold hover:bg-red-50 rounded-2xl transition-all overflow-hidden"
            :title="isCollapsed ? $t('admin.logout') : ''"
          >
            <span class="text-xl shrink-0 rotate-180">➜]</span>
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.logout")
            }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Mobile Top Bar -->
      <header
        class="md:hidden h-16 bg-white border-b px-6 flex items-center justify-between z-30"
      >
        <button
          @click="isMobileOpen = true"
          class="p-2 -mr-2 text-gray-400 hover:text-orange-600 transition-colors"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span class="font-black text-orange-600 italic">MenuJet</span>
      </header>

      <!-- Main Scrollable Area -->
      <main dir="ltr" class="flex-1 p-4 md:p-10 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const { locale, locales, setLocale } = useI18n();
const { $toast } = useNuxtApp();
const profile = ref(null);

// UI States
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const showLogoutModal = ref(false);
const isLangDropdownOpen = ref(false);

const fetchProfile = async () => {
  if (!user.value) return;
  const { data } = await client
    .from("profiles")
    .select("slug, business_name")
    .eq("user_id", user.value.sub)
    .single();
  profile.value = data;
};

watch(
  user,
  (newUser) => {
    if (newUser) fetchProfile();
  },
  { immediate: true },
);

const handleLogout = async () => {
  showLogoutModal.value = false;
  await client.auth.signOut();
  $toast.success($t("admin.logout_success"));
  navigateTo("/login");
};

const changeLanguage = (code) => {
  setLocale(code);
  isLangDropdownOpen.value = false;
};
</script>

<style scoped>
/* Optional styling to match design tokens */
@media (min-width: 768px) {
  aside {
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
