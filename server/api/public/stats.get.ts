import { serverSupabaseServiceRole } from "#supabase/server";

interface PublicStatsResponse {
  itemsCount: number;
  totalSales: number;
}

interface StatsProfileRow {
  user_id: string | null;
  subscription_status: string | null;
  is_demo?: boolean | null;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const ORDERS_PAGE_SIZE = 1000;

let cachedStats: PublicStatsResponse | null = null;
let cachedAt = 0;
let cachedVersion = 0;

async function fetchTotalOrderSales(
  adminClient: ReturnType<typeof serverSupabaseServiceRole>,
  ownerIds: string[],
): Promise<number> {
  let totalSales = 0;
  let from = 0;

  while (true) {
    const { data: batch, error } = await adminClient
      .from("orders")
      .select("total_price")
      .in("user_id", ownerIds)
      .range(from, from + ORDERS_PAGE_SIZE - 1);

    if (error) throw error;
    if (!batch || batch.length === 0) break;

    for (const order of batch) {
      const price = Number(
        (order as { total_price: number | string | null }).total_price || 0,
      );
      if (Number.isFinite(price) && price > 0) {
        totalSales += price;
      }
    }

    if (batch.length < ORDERS_PAGE_SIZE) break;
    from += ORDERS_PAGE_SIZE;
  }

  return Math.round(totalSales);
}

export default defineEventHandler(
  async (event): Promise<PublicStatsResponse> => {
    setHeader(
      event,
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    const now = Date.now();
    const version = getPublicDataVersion();
    if (
      cachedStats &&
      cachedVersion === version &&
      now - cachedAt < CACHE_TTL_MS
    ) {
      return cachedStats;
    }

    try {
      const adminClient = serverSupabaseServiceRole(event);

      let { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("user_id, subscription_status, is_demo")
        .is("owner_id", null)
        .neq("role", "super_admin");

      if (
        profilesError &&
        (profilesError.message?.includes("column") ||
          (profilesError as { code?: string }).code === "PGRST204")
      ) {
        const fallback = await adminClient
          .from("profiles")
          .select("user_id, subscription_status")
          .is("owner_id", null)
          .neq("role", "super_admin");
        profiles = fallback.data as StatsProfileRow[] | null;
        profilesError = fallback.error;
      }

      if (profilesError) throw profilesError;

      const ownerIds = ((profiles || []) as StatsProfileRow[])
        .filter((p) => {
          if (p.is_demo) return false;
          const status = String(p.subscription_status || "").trim().toLowerCase();
          return status !== "trial" && status !== "inactive";
        })
        .map((p) => p.user_id)
        .filter((id): id is string => Boolean(id));

      if (ownerIds.length === 0) {
        const emptyStats: PublicStatsResponse = {
          itemsCount: 0,
          totalSales: 0,
        };
        cachedStats = emptyStats;
        cachedAt = now;
        cachedVersion = version;
        return emptyStats;
      }

      const [itemsRes, totalSales] = await Promise.all([
        adminClient
          .from("menu_items")
          .select("id", { count: "exact", head: true })
          .in("user_id", ownerIds),
        fetchTotalOrderSales(adminClient, ownerIds),
      ]);

      if (itemsRes.error) throw itemsRes.error;

      const freshStats: PublicStatsResponse = {
        itemsCount: itemsRes.count || 0,
        totalSales,
      };

      cachedStats = freshStats;
      cachedAt = now;
      cachedVersion = version;
      cachedAt = now;
      return freshStats;
    } catch (error) {
      console.error("Public stats error:", error);
      return cachedStats ?? { itemsCount: 0, totalSales: 0 };
    }
  },
);
