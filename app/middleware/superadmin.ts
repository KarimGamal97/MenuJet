// middleware/superadmin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  const varPcb = useSupabaseUser();

  if (!varPcb.value) {
    return navigateTo("/login");
  }

  if (!authStore.profile) {
    await authStore.fetchUserProfile();
  }

  if (!authStore.isSuperAdmin) {
    return navigateTo("/unauthorized");
  }
});
