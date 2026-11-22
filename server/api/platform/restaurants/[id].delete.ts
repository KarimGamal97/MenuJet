export default defineEventHandler(async (event) => {
  const { adminClient } = await requirePlatformOwner(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Restaurant id is required" });
  }

  const { data: target, error: fetchError } = await adminClient
    .from("profiles")
    .select("id, user_id, role")
    .eq("id", id)
    .single();

  if (fetchError || !target) {
    throw createError({ statusCode: 404, message: "Restaurant not found" });
  }

  if (target.role === "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Cannot delete platform owner account",
    });
  }

  // Delete any sub-users linked under this restaurant owner first
  const ownerUid = target.user_id || target.id;
  const { data: staffProfiles } = await adminClient
    .from("profiles")
    .select("user_id")
    .eq("owner_id", ownerUid);

  for (const staff of staffProfiles || []) {
    if (staff.user_id) {
      await adminClient.auth.admin.deleteUser(staff.user_id);
    }
  }

  if (target.user_id) {
    const { error: deleteAuthError } =
      await adminClient.auth.admin.deleteUser(target.user_id);
    if (deleteAuthError) {
      throw createError({ statusCode: 500, message: deleteAuthError.message });
    }
  } else {
    const { error: deleteProfileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", id);
    if (deleteProfileError) {
      throw createError({
        statusCode: 500,
        message: deleteProfileError.message,
      });
    }
  }

  return { success: true };
});
