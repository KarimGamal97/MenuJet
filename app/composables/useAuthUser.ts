/**
 * useAuthUser
 * -----------
 * Centralized composable to get the current authenticated user and their ID.
 * Handles both `user.id` (standard JWT) and `user.sub` (Supabase session token fallback).
 *
 * Usage:
 *   const { userId } = useAuthUser();
 */
export const useAuthUser = () => {
  const user = useSupabaseUser();
  const userId = computed(() => user.value?.id || user.value?.sub || null);

  return { user, userId };
};
