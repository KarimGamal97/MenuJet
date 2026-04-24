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

  // useState = shared state across all components (survives page navigation & refresh)
  const ownerId = useState<string | null>('auth_owner_id', () => null);
  const userRole = useState<string | null>('auth_user_role', () => null);

  // Only fetch if we have a userId but ownerId is not set yet
  watchEffect(async () => {
    const uid = userId.value;
    if (!uid) return;
    if (ownerId.value) return; // Already resolved, skip re-fetching

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
