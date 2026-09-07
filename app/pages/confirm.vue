<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
    <div class="text-center space-y-4 max-w-sm w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <h3 class="text-lg font-black text-gray-900">جاري تسجيل الدخول...</h3>
      <p class="text-gray-500 text-sm font-medium">يتم الآن تجهيز لوحة تحكم مطعمك في MenuJet 🚀</p>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const finishOnboarding = async () => {
  const pendingName = localStorage.getItem("pending_restaurant_name");
  if (pendingName && user.value?.id) {
    try {
      await client
        .from("profiles")
        .update({
          business_name: pendingName,
          business_name_ar: pendingName,
        })
        .eq("user_id", user.value.id);
      localStorage.removeItem("pending_restaurant_name");
    } catch (e) {
      console.error("Failed to update pending restaurant name:", e);
    }
  }
  return navigateTo("/admin");
};

watch(
  user,
  async (val) => {
    if (val) {
      await finishOnboarding();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  // Direct fallback in case watcher was already evaluated
  const { data } = await client.auth.getSession();
  if (data?.session?.user) {
    await finishOnboarding();
  }
});
</script>
