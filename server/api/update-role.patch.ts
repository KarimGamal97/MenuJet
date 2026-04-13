import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  // Only authenticated super admins can update roles
  const requestingUser = await serverSupabaseUser(event);
  if (!requestingUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const callerRole =
    requestingUser.user_metadata?.role || requestingUser.app_metadata?.role;

  if (callerRole !== "super_admin") {
    throw createError({ statusCode: 403, message: "Forbidden: Super admin only" });
  }

  const { profileId, newRole } = await readBody(event);

  if (!profileId || !newRole) {
    throw createError({ statusCode: 400, message: "profileId and newRole are required" });
  }

  // Use service role to bypass RLS + FK permission issues
  const adminClient = serverSupabaseServiceRole(event);

  const { error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", profileId);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true };
});
