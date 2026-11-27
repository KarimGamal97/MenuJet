<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Backdrop for mobile -->
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300"
      @click="isMobileOpen = false"
    ></div>

    <!-- Logout Confirmation Modal -->
    <AdminLayoutLogoutModal
      :open="showLogoutModal"
      @close="showLogoutModal = false"
      @confirm="handleLogout"
    />

    <!-- Sidebar -->
    <AdminLayoutAdminSidebar
      :isMobileOpen="isMobileOpen"
      :isCollapsed="isCollapsed"
      :profileName="profileName"
      :profileLogo="profileLogo"
      :userRole="userRole"
      :isSuperAdmin="isSuperAdmin"
      :canManageRestaurant="canManageRestaurant"
      :isTrial="isTrial"
      :trialTimeLeft="trialTimeLeft"
      :trialBadgeText="trialBadgeText"
      :currentPlan="currentPlan"
      :isFree="isFree"
      :isBasic="isBasic"
      :isPro="isPro"
      :canAllowAnalytics="can('allow_analytics')"
      :canAllowUsers="can('allow_users')"
      @toggleCollapse="isCollapsed = !isCollapsed"
      @openUpgrade="showUpgradeModal = true"
      @openLogout="showLogoutModal = true"
    />

    <!-- Upgrade Plan Modal in Layout -->
    <UpgradeModal
      :isOpen="showUpgradeModal"
      limitType="general"
      :businessName="profileName"
      @close="showUpgradeModal = false"
    />

    <!-- Paywall / Expired Subscription Modal -->
    <AdminLayoutExpiredPaywallModal
      :open="Boolean(trialTimeLeft?.expired) && !isSuperAdmin"
      :profileName="profileName"
      @logout="handleLogout"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="md:hidden h-16 bg-white border-b px-6 flex items-center justify-between z-30">
        <button
          @click="isMobileOpen = true"
          class="p-2 -mr-2 text-gray-400 hover:text-orange-600 transition-colors"
        >
          <BaseIcon name="menu" class="h-6 w-6" />
        </button>
        <span class="font-black text-orange-600">MenuJet</span>
      </header>

      <main :dir="locale === 'ar' ? 'rtl' : 'ltr'" class="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const client = useSupabaseClient();
const { userRole, ownerId, canManageRestaurant } = useAuthUser();
const { startGlobalOrderListener, stopGlobalOrderListener } = useOrderNotifications();
const { currentPlan, isFree, isBasic, isPro, can } = usePlan();
const { t, locale } = useI18n();
const { $toast } = useNuxtApp();

useSeoMeta({
  robots: 'noindex, nofollow',
});

const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const showLogoutModal = ref(false);
const showUpgradeModal = ref(false);
const localProfile = ref(null);
const adminSplashPending = useState('adminSplashPending', () => !authStore.profile);

const profileName = computed(() =>
  authStore.profile?.business_name ||
  authStore.profile?.business_name_ar ||
  authStore.profile?.business_name_en ||
  authStore.profile?.full_name ||
  ''
);

const profileLogo = computed(() =>
  authStore.profile?.logo ||
  localProfile.value?.logo ||
  ''
);

const isSuperAdmin = computed(() => localProfile.value?.role === 'super_admin');

const parseDateSafe = (dateStr) => {
  if (!dateStr) return NaN;
  if (dateStr instanceof Date) return dateStr.getTime();
  let s = String(dateStr).trim();
  if (s.includes(' ') && !s.includes('T')) {
    s = s.replace(' ', 'T');
  }
  s = s.replace(/([+-]\d{2})$/, '$1:00');
  const timestamp = new Date(s).getTime();
  if (!isNaN(timestamp)) return timestamp;
  return new Date(dateStr).getTime();
};

const isTrial = computed(() => {
  return localProfile.value?.subscription_status === 'trial' || isFree.value;
});

const subscriptionEndDate = computed(() => {
  const p = localProfile.value || authStore.profile || {};
  return (
    p.subscription_end_date ||
    p.subscription_ends_at ||
    p.trial_end_date ||
    p.trial_ends_at ||
    p.trial_end ||
    p.expires_at ||
    p.end_date ||
    null
  );
});

const now = ref(Date.now());
let timerInterval = null;

onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

watch(
  ownerId,
  (newOwnerId) => {
    if (newOwnerId) {
      startGlobalOrderListener(newOwnerId);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  stopGlobalOrderListener();
});

const trialTimeLeft = computed(() => {
  if (!subscriptionEndDate.value) return null;
  const end = parseDateSafe(subscriptionEndDate.value);
  if (isNaN(end)) return null;

  const diffMs = end - now.value;
  if (diffMs <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    expired: false,
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
    diffMs,
  };
});

const trialBadgeText = computed(() => {
  if (!trialTimeLeft.value) return '';
  if (trialTimeLeft.value.expired) return t('plans.trial_expired');

  const { days, hours, minutes } = trialTimeLeft.value;
  if (locale.value === 'ar') {
    if (days >= 3 && days <= 10) return `${days} أيام`;
    if (days > 10) return `${days} يوم`;
    if (days === 2) return 'يومين';
    if (days === 1) return hours > 0 ? `يوم و ${hours} ساعة` : 'يوم واحد';
    if (hours > 0) return `${hours} س و ${minutes} د`;
    return `${minutes} دقيقة`;
  }
  if (days > 1) return `${days} days left`;
  if (days === 1) return `1 day, ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
});

const fetchProfile = async (userId) => {
  let { data } = await client
    .from('profiles')
    .select('*, plans(*)')
    .or(`user_id.eq.${userId},id.eq.${userId}`)
    .maybeSingle();

  if (!data) {
    const res = await client
      .from('profiles')
      .select('*')
      .or(`user_id.eq.${userId},id.eq.${userId}`)
      .maybeSingle();
    data = res.data;
  }

  if (data) {
    if (data.plans) data.plan = data.plans;
    if (data.owner_id) {
      const { data: ownerData } = await client
        .from('profiles')
        .select('*')
        .or(`user_id.eq.${data.owner_id},id.eq.${data.owner_id}`)
        .maybeSingle();

      if (ownerData) {
        if (!data.business_name && ownerData.business_name) data.business_name = ownerData.business_name;
        if (!data.business_name_ar && ownerData.business_name_ar) data.business_name_ar = ownerData.business_name_ar;
        if (!data.business_name_en && ownerData.business_name_en) data.business_name_en = ownerData.business_name_en;
        if (!data.logo && ownerData.logo) data.logo = ownerData.logo;
        if (!data.subscription_end_date && ownerData.subscription_end_date) {
          data.subscription_end_date = ownerData.subscription_end_date;
        }
      }
    }

    localProfile.value = data;
    authStore.profile = data;
  }
};

onMounted(async () => {
  try {
    if (!authStore.profile) {
      adminSplashPending.value = true;
    }
    const { data: { user: authUser } } = await client.auth.getUser();
    if (authUser?.id) {
      await fetchProfile(authUser.id);
    }
  } finally {
    adminSplashPending.value = false;
  }
});

const handleLogout = async () => {
  showLogoutModal.value = false;
  await client.auth.signOut();
  localProfile.value = null;
  authStore.profile = null;
  $toast.success(t('admin.logout_success'));
  navigateTo('/login');
};
</script>
