import { serverSupabaseServiceRole } from "#supabase/server";

interface PublicStatsResponse {
  itemsCount: number;
  totalSales: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const ORDERS_PAGE_SIZE = 1000;

let cachedStats: PublicStatsResponse | null = null;
let cachedAt = 0;

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
    if (cachedStats && now - cachedAt < CACHE_TTL_MS) {
      return cachedStats;
    }

    try {
      const adminClient = serverSupabaseServiceRole(event);

      const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("user_id")
        .is("owner_id", null)
        .neq("role", "super_admin");

      if (profilesError) throw profilesError;

      const ownerIds = (profiles || [])
        .map((p: { user_id: string | null }) => p.user_id)
        .filter((id): id is string => Boolean(id));

      if (ownerIds.length === 0) {
        const emptyStats: PublicStatsResponse = {
          itemsCount: 0,
          totalSales: 0,
        };
        cachedStats = emptyStats;
        cachedAt = now;
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
      return freshStats;
    } catch (error) {
      console.error("Public stats error:", error);
      return cachedStats ?? { itemsCount: 0, totalSales: 0 };
    }
  },
);
