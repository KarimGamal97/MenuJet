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

  watchEffect(async () => {
    const uid = userId.value;
    console.log('[useAuthUser] watchEffect fired. uid:', uid, '| ownerId:', ownerId.value);

    // User logged out → reset state
    if (!uid) {
      ownerId.value = null;
      userRole.value = null;
      return;
    }

    if (ownerId.value) {
      console.log('[useAuthUser] ownerId already set, skipping fetch:', ownerId.value);
      return;
    }

    console.log('[useAuthUser] Fetching profile for uid:', uid);
    const { data, error } = await client
      .from('profiles')
      .select('owner_id, role')
      .eq('user_id', uid)
      .maybeSingle();

    console.log('[useAuthUser] Profile fetch result → data:', data, '| error:', error);

    userRole.value = data?.role || null;
    ownerId.value = data?.owner_id || uid;
    console.log('[useAuthUser] ownerId set to:', ownerId.value);
  });

  return { user, userId, ownerId, userRole };
};
