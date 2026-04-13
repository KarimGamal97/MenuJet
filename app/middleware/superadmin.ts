// middleware/superadmin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  if (import.meta.server) {
    const { auth } = useSupabaseClient();
    const {
      data: { session },
    } = await auth.getSession();
    if (!session) return navigateTo("/login");
  } else {
    if (!user.value) return navigateTo("/login");
  }

  const authStore = useAuthStore();

  if (!authStore.profile) {
    await authStore.fetchUserProfile();
  }

  if (!authStore.isSuperAdmin) {
    return navigateTo("/admin/dashboard");
  }
});
