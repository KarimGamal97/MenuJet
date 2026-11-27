const PLAN_LIMITS: Record<
  string,
  { max_items: number | null; max_categories: number | null }
> = {
  free: { max_items: 130, max_categories: null },
  basic: { max_items: 100, max_categories: null },
  pro: { max_items: 130, max_categories: null },
};

export default defineEventHandler(async (event) => {
  const { adminClient } = await requirePlatformOwner(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Restaurant id is required" });
  }

  const body = await readBody(event);
  const {
    plan_id,
    subscription_status,
    subscription_end_date,
    show_in_clients,
    is_demo,
  } = body;

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

  if (typeof is_demo === "boolean") {
    patch.is_demo = is_demo;
    if (is_demo) {
      patch.show_in_clients = false;
    }
  }

  if (typeof show_in_clients === "boolean" && patch.is_demo !== true) {
    patch.show_in_clients = show_in_clients;
  }

  if (Object.keys(patch).length === 0) {
    throw createError({ statusCode: 400, message: "No valid fields to update" });
  }

  const { data: updated, error: updateError } = await adminClient
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select(
      "id, user_id, email, full_name, business_name, business_name_ar, business_name_en, slug, whatsapp_number, role, plan_id, plan_type, max_items, max_categories, subscription_status, subscription_end_date, is_active, show_in_clients, is_demo, created_at",
    )
    .single();

  if (updateError) {
    throw createError({ statusCode: 500, message: updateError.message });
  }

  invalidatePublicDataCaches();

  return updated;
});
