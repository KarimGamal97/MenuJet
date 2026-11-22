export default defineEventHandler(async (event) => {
  const { adminClient, callerRole, effectiveOwnerId } =
    await requireRestaurantManager(event);

  const { profileId } = await readBody(event);

  if (!profileId) {
    throw createError({ statusCode: 400, message: "profileId is required" });
  }

  const { data: profileData, error: profileError } = await adminClient
    .from("profiles")
    .select("user_id, owner_id, role")
    .eq("id", profileId)
    .single();

  if (profileError || !profileData?.user_id) {
    throw createError({
      statusCode: 404,
      message: "Profile or user ID not found",
    });
  }

  // Prevent non-platform owners from deleting other restaurants or primary owners
  if (callerRole !== "super_admin") {
    if (
      profileData.owner_id !== effectiveOwnerId ||
      profileData.role === "super_admin"
    ) {
      throw createError({
        statusCode: 403,
        message: "غير مصرح لك بحذف هذا الحساب",
      });
    }
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    profileData.user_id,
  );

  if (deleteError) {
    throw createError({ statusCode: 500, message: deleteError.message });
  }

  return { success: true };
});
