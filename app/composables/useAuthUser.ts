/**
 * useAuthUser
 * -----------
 * Centralized composable to get the current authenticated user, their ID,
 * role, and effective owner ID (for admin users sharing a restaurant).
 *
 * Usage:
 *   const { userId, ownerId, userRole } = useAuthUser();
 *
 * - ownerId: if the user has an owner_id (admin under a super_admin), use that for data fetching.
 *            Otherwise falls back to their own userId.
 * - userRole: 'super_admin' | 'admin' | 'user' — fetched from profiles table.
 */
export const useAuthUser = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();

  const userId = computed(() => user.value?.id || user.value?.sub || null);

  const ownerId = ref<string | null>(null);
  const userRole = ref<string | null>(null);

  // Fetch profile to get owner_id and role
  watchEffect(async () => {
    const uid = userId.value;
    if (!uid) return;

    const { data } = await client
      .from('profiles')
      .select('owner_id, role')
      .or(`id.eq.${uid},user_id.eq.${uid}`)
      .single();

    userRole.value = data?.role || null;
    // If admin has an owner, use that; otherwise use their own userId
    ownerId.value = data?.owner_id || uid;
  });

  return { user, userId, ownerId, userRole };
};
