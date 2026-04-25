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

  const userId = requestingUser.id || (requestingUser as any).sub || (requestingUser as any).user?.id;
  if (!userId) {
    throw createError({ statusCode: 401, message: "لم يتم التعرف على هوية المستخدم" });
  }

  // Use service role to bypass RLS + Auth permissions
  const adminClient = serverSupabaseServiceRole(event);

  // Fetch the caller's profile to check their role
  const { data: callerProfile } = await adminClient
    .from("profiles")
    .select("role")
    .or(`user_id.eq.${userId},id.eq.${userId}`)
    .limit(1)
    .single();

  const callerRole = (callerProfile?.role || requestingUser.user_metadata?.role || requestingUser.app_metadata?.role || "").toLowerCase();

  if (callerRole !== "super_admin") {
    throw createError({ statusCode: 403, message: "عذراً، هذه الصلاحية للمدير العام فقط" });
  }

  const { profileId } = await readBody(event);

  if (!profileId) {
    throw createError({ statusCode: 400, message: "profileId is required" });
  }

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
