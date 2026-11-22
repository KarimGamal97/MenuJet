export default defineEventHandler(async (event) => {
  const { adminClient, callerRole, effectiveOwnerId } =
    await requireRestaurantManager(event);

  const { profileId, newRole } = await readBody(event);

  if (!profileId || !newRole) {
    throw createError({
      statusCode: 400,
      message: "profileId and newRole are required",
    });
  }

  const allowedRoles = callerRole === "super_admin" ? ["admin", "user"] : ["user"];
  if (!allowedRoles.includes(newRole)) {
    throw createError({
      statusCode: 403,
      message: "غير مصرح لك بتعيين هذا الدور",
    });
  }

  const { data: targetProfile } = await adminClient
    .from("profiles")
    .select("id, owner_id")
    .eq("id", profileId)
    .single();

  if (!targetProfile) {
    throw createError({ statusCode: 404, message: "Profile not found" });
  }

  if (
    callerRole !== "super_admin" &&
    targetProfile.owner_id !== effectiveOwnerId
  ) {
    throw createError({
      statusCode: 403,
      message: "غير مصرح لك بتعديل هذا الحساب",
    });
  }

  const { error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", profileId);

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return { success: true };
});
