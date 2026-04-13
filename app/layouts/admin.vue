<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
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
            <div
              class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"
            >
              <BaseIcon name="logout" class="w-8 h-8" />
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
        isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
        isCollapsed ? 'w-20 md:w-24' : 'w-64',
      ]"
      class="fixed inset-y-0 right-0 z-50 bg-white border-l flex flex-col transition-all duration-300 ease-in-out shrink-0 md:sticky md:top-0 md:h-screen md:inset-y-auto"
    >
      <!-- Collapse Button -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="flex absolute -left-3 top-12 bg-white border border-gray-200 rounded-full w-7 h-7 items-center justify-center text-gray-400 hover:text-orange-600 shadow-sm z-50"
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
        <!-- Restaurant Name -->
        <div
          class="bg-gradient-to-l from-orange-600 to-orange-500 rounded-2xl mb-8 flex items-center justify-center shrink-0 shadow-lg shadow-orange-100 transition-all duration-300 overflow-hidden"
          :class="isCollapsed ? 'h-14 w-14' : 'p-4'"
        >
          <h1
            class="font-black text-white leading-tight truncate px-2"
            :class="isCollapsed ? 'text-xl' : 'text-lg'"
          >
            {{
              isCollapsed && profileName
                ? profileName[0]
                : profileName
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
            <BaseIcon
              name="home"
              class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.dashboard")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/menu"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <BaseIcon
              name="food"
              class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.menu")
            }}</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <BaseIcon
              name="cart"
              class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.orders")
            }}</span>
          </NuxtLink>

          <NuxtLink
            v-if="userRole === 'super_admin'"
            to="/admin/sales"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <BaseIcon
              name="chart"
              class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{ $t("admin.sales") }}</span>
          </NuxtLink>

          <NuxtLink
            v-if="userRole === 'super_admin'"
            to="/admin/settings"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-orange-50 text-gray-500 overflow-hidden group"
            active-class="bg-orange-50 text-orange-600 shadow-sm shadow-orange-50"
          >
            <BaseIcon
              name="settings"
              class="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform"
            />
            <span v-show="!isCollapsed" class="whitespace-nowrap">{{
              $t("admin.settings")
            }}</span>
          </NuxtLink>

          <NuxtLink
            v-if="isSuperAdmin"
            to="/admin/users"
            class="flex items-center gap-3 p-4 rounded-2xl transition-all font-bold hover:bg-purple-50 text-gray-500 overflow-hidden group"
            active-class="bg-purple-50 text-purple-600 shadow-sm"
          >
            <BaseIcon name="users" class="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
            <span v-show="!isCollapsed" class="whitespace-nowrap"> {{ $t("admin.users") }} </span>
          </NuxtLink>

          <!-- Language Switcher Dropdown -->
          <!-- <div class="relative">
            <button
              @click="isLangDropdownOpen = !isLangDropdownOpen"
              class="flex items-center gap-3 w-full p-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all overflow-hidden"
              :class="
                isLangDropdownOpen ? 'bg-gray-50 ring-1 ring-gray-100' : ''
              "
            >
              <BaseIcon name="globe" class="w-6 h-6 shrink-0" />
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
          </div> -->
        </nav>

        <!-- Sidebar Footer -->
        <div class="mt-auto pt-6 space-y-2 border-t border-gray-100">
          <button
            @click="showLogoutModal = true"
            class="flex items-center gap-3 w-full p-4 text-red-700 font-bold hover:bg-red-50 rounded-2xl transition-all overflow-hidden"
            :title="isCollapsed ? $t('admin.logout') : ''"
          >
            <BaseIcon name="logout" class="w-6 h-6 shrink-0" />
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
          <BaseIcon name="menu" class="h-6 w-6" />
        </button>
        <span class="font-black text-orange-600">MenuJet</span>
      </header>

      <!-- Main Scrollable Area -->
      <main dir="ltr" class="flex-1 p-4 md:p-10 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const client = useSupabaseClient();
const user = useSupabaseUser();
const { userRole } = useAuthUser();
const { $toast } = useNuxtApp();
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const showLogoutModal = ref(false);

// Local profile ref — direct fetch, no store dependency for display
const localProfile = ref(null);

const profileName = computed(() =>
  localProfile.value?.business_name_ar ||
  localProfile.value?.business_name_en ||
  localProfile.value?.full_name ||
  ''
);

const isSuperAdmin = computed(() => localProfile.value?.role === 'super_admin');

const fetchProfile = async (userId) => {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!error && data) {
    // If this is a regular admin without a business name, fetch the owner's business name for display
    if (data.role === 'admin' && data.owner_id && !data.business_name_ar) {
      const { data: ownerData } = await client
        .from('profiles')
        .select('business_name_ar, business_name_en')
        .eq('user_id', data.owner_id)
        .single();
        
      if (ownerData) {
        data.business_name_ar = ownerData.business_name_ar;
        data.business_name_en = ownerData.business_name_en;
      }
    }

    localProfile.value = data;
    authStore.profile = data;
  }
};

// Use client.auth.getUser() — more reliable than useSupabaseUser() in layouts
onMounted(async () => {
  const { data: { user: authUser } } = await client.auth.getUser();
  if (authUser?.id) {
    await fetchProfile(authUser.id);
  }
});

const handleLogout = async () => {
  showLogoutModal.value = false;
  await client.auth.signOut();
  localProfile.value = null;
  authStore.profile = null;
  $toast.success('تم تسجيل الخروج بنجاح');
  navigateTo('/login');
};
</script>

<style scoped>
@media (min-width: 768px) {
  aside {
    border-left: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
