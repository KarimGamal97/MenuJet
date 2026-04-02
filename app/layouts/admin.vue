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
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </div>
          </div>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.dashboard")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/menu"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.375 3h17.25c.621 0 1.125-.504 1.125-1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.114-.94h1.086c.554 0 1.024.398 1.114.94l.15 1.033A1.875 1.875 0 0 0 15.42 6.5l.84-.368c.503-.22 1.085-.017 1.353.46l.543.94c.268.477.16 1.077-.247 1.455l-.768.71a1.875 1.875 0 0 0-.586 1.884l.15 1.033c.09.542-.38 1.01-.933 1.01h-1.086c-.554 0-1.024-.398-1.114-.94l-.15-1.033a1.875 1.875 0 0 0-1.614-1.54l-.84.368c-.503.22-1.085.017-1.353-.46l-.543-.94c-.268-.477-.16-1.077.247-1.455l.768-.71a1.875 1.875 0 0 0 .586-1.884l-.15-1.033a1.875 1.875 0 0 0 1.614-1.54l.84-.368c.503-.22 1.085-.017 1.353.46l.543.94c.268.477.16 1.077-.247 1.455l-.768.71a1.875 1.875 0 0 0-.586 1.884l.15 1.033c.09.542.413-.94.966-.94h1.086c.554 0 1.024.398 1.114.94l.15 1.033a1.875 1.875 0 0 0 1.614 1.54l.84-.368c.503-.22 1.085-.017 1.353.46l.543.94c.268.477.16 1.077-.247 1.455l-.768.71a1.875 1.875 0 0 0-.586 1.884l.15 1.033c.09.542.36-.94-.194-.94h-1.086" />
            </svg>
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.settings")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
              </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
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
