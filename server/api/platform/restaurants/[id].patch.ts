const PLAN_LIMITS: Record<
  string,
  { max_items: number | null; max_categories: number | null }
> = {
  free: { max_items: 20, max_categories: 5 },
  basic: { max_items: null, max_categories: null },
  pro: { max_items: null, max_categories: null },
};

export default defineEventHandler(async (event) => {
  const { adminClient } = await requirePlatformOwner(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Restaurant id is required" });
  }

  const body = await readBody(event);
  const { plan_id, subscription_status, subscription_end_date } = body;

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
      message: "Cannot modify platform owner account",
    });
  }

  const patch: Record<string, any> = {};

  if (plan_id && PLAN_LIMITS[plan_id]) {
    patch.plan_id = plan_id;
    patch.plan_type = plan_id;
    patch.max_items = PLAN_LIMITS[plan_id].max_items;
    patch.max_categories = PLAN_LIMITS[plan_id].max_categories;
  }

  if (
    subscription_status &&
    ["active", "trial", "expired", "inactive"].includes(subscription_status)
  ) {
    patch.subscription_status = subscription_status;
  }

  if (subscription_end_date !== undefined) {
    patch.subscription_end_date = subscription_end_date || null;
  }

  if (Object.keys(patch).length === 0) {
    throw createError({ statusCode: 400, message: "No valid fields to update" });
  }

  const { data: updated, error: updateError } = await adminClient
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select(
      "id, user_id, email, full_name, business_name, business_name_ar, business_name_en, slug, whatsapp_number, role, plan_id, plan_type, max_items, max_categories, subscription_status, subscription_end_date, is_active, created_at",
    )
    .single();

  if (updateError) {
    throw createError({ statusCode: 500, message: updateError.message });
  }

  return updated;
});
