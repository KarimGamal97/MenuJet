import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  // Only authenticated super admins can delete users
  const requestingUser = await serverSupabaseUser(event);
  if (!requestingUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const callerRole =
    requestingUser.user_metadata?.role || requestingUser.app_metadata?.role;

  if (callerRole !== "super_admin") {
    throw createError({ statusCode: 403, message: "Forbidden: Super admin only" });
  }

  const { profileId } = await readBody(event);

  if (!profileId) {
    throw createError({ statusCode: 400, message: "profileId is required" });
  }

  // Use service role to bypass RLS + Auth permissions
  const adminClient = serverSupabaseServiceRole(event);

  // Get the user's auth ID (user_id) from the profile
  const { data: profileData, error: profileError } = await adminClient
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .single();

  if (profileError || !profileData?.user_id) {
    throw createError({ statusCode: 404, message: "Profile or user ID not found" });
  }

  // Delete from auth.users (this will cascade to profiles and menu_items)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    profileData.user_id
  );

  if (deleteError) {
    throw createError({ statusCode: 500, message: deleteError.message });
  }

  return { success: true };
});
