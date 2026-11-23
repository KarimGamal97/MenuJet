const PLAN_MONTHLY_EGP: Record<string, number> = {
  free: 0,
  basic: 250,
  pro: 500,
};

function isExpiredRow(profile: Record<string, any>): boolean {
  const status = String(profile.subscription_status || "").toLowerCase();
  if (status === "expired" || status === "inactive" || status === "cancelled") {
    return true;
  }
  const endDate = profile.subscription_end_date;
  if (!endDate) return false;
  const ts = new Date(endDate).getTime();
  return !isNaN(ts) && ts < Date.now();
}

function getRestaurantName(p: Record<string, any>): string {
  return (
    p.business_name_ar ||
    p.business_name ||
    p.business_name_en ||
    p.full_name ||
    p.email?.split("@")[0] ||
    p.slug ||
    "—"
  );
}

export default defineEventHandler(async (event) => {
  try {
    const { adminClient } = await requirePlatformOwner(event);
    const todayStart = new Date().toISOString().split("T")[0];

    const [profilesRes, allOrdersRes] = await Promise.all([
      adminClient
        .from("profiles")
        .select(
          "id, user_id, email, full_name, business_name, business_name_ar, business_name_en, slug, whatsapp_number, plan_id, plan_type, subscription_status, subscription_end_date",
        )
        .is("owner_id", null)
        .neq("role", "super_admin"),
      adminClient
        .from("orders")
        .select("user_id, total_price, created_at"),
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (allOrdersRes.error) throw allOrdersRes.error;

    const clients = profilesRes.data || [];
    const allOrders = allOrdersRes.data || [];

    // Aggregate orders per restaurant user_id
    const ordersByOwner: Record<string, { count: number; revenue: number }> = {};
    let todayOrders = 0;
    let totalOrdersRevenue = 0;

    for (const o of allOrders) {
      const price = Number(o.total_price || 0);
      totalOrdersRevenue += price;
      if (o.created_at && String(o.created_at) >= todayStart) {
        todayOrders++;
      }
      if (o.user_id) {
        if (!ordersByOwner[o.user_id]) {
          ordersByOwner[o.user_id] = { count: 0, revenue: 0 };
        }
        ordersByOwner[o.user_id].count++;
        ordersByOwner[o.user_id].revenue += price;
      }
    }

    const planBreakdown: Record<"pro" | "basic" | "free", { count: number; revenue: number }> = {
      pro: { count: 0, revenue: 0 },
      basic: { count: 0, revenue: 0 },
      free: { count: 0, revenue: 0 },
    };

    let activeClients = 0;
    let subscriptionRevenue = 0;
    const renewalsDue: any[] = [];
    const restaurantActivity: any[] = [];

    for (const c of clients) {
      const expired = isExpiredRow(c);
      const rawPlan = String(c.plan_id || c.plan_type || "free").toLowerCase();
      const planId = (rawPlan === "pro" || rawPlan === "basic" ? rawPlan : "free") as
        | "pro"
        | "basic"
        | "free";

      planBreakdown[planId].count++;

      if (!expired) {
        activeClients++;
        const monthlyVal = PLAN_MONTHLY_EGP[planId] || 0;
        subscriptionRevenue += monthlyVal;
        planBreakdown[planId].revenue += monthlyVal;
      }

      const endMs = c.subscription_end_date ? new Date(c.subscription_end_date).getTime() : NaN;
      const daysRemaining = !isNaN(endMs)
        ? Math.ceil((endMs - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      if (expired || (daysRemaining !== null && daysRemaining <= 7)) {
        renewalsDue.push({
          id: c.id,
          name: getRestaurantName(c),
          slug: c.slug,
          whatsapp_number: c.whatsapp_number,
          planId,
          expired,
          daysRemaining,
          subscription_end_date: c.subscription_end_date,
        });
      }

      const activity = ordersByOwner[c.user_id] || { count: 0, revenue: 0 };
      restaurantActivity.push({
        id: c.id,
        name: getRestaurantName(c),
        slug: c.slug,
        planId,
        ordersCount: activity.count,
        revenue: activity.revenue,
      });
    }

    const topRestaurants = restaurantActivity
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 5);

    renewalsDue.sort((a, b) => {
      if (a.expired !== b.expired) return a.expired ? -1 : 1;
      return (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999);
    });

    return {
      totalClients: clients.length,
      activeClients,
      subscriptionRevenue,
      totalOrders: allOrders.length,
      todayOrders,
      totalOrdersRevenue,
      planBreakdown,
      topRestaurants,
      renewalsDue: renewalsDue.slice(0, 6),
    };
  } catch (error: any) {
    console.error("Platform overview error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch platform overview",
    });
  }
});
