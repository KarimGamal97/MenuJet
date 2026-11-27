import { serverSupabaseServiceRole } from "#supabase/server";

export interface PublicClientItem {
  slug: string;
  name: string;
  nameAr: string;
  nameEn: string;
  logo: string;
}

interface ProfileClientRow {
  slug: string | null;
  business_name: string | null;
  business_name_ar: string | null;
  business_name_en: string | null;
  logo: string | null;
  show_in_clients?: boolean | null;
  is_demo?: boolean | null;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedClients: PublicClientItem[] | null = null;
let cachedAt = 0;
let cachedVersion = 0;

export default defineEventHandler(
  async (event): Promise<{ clients: PublicClientItem[] }> => {
    setHeader(
      event,
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    const now = Date.now();
    const version = getPublicDataVersion();
    if (
      cachedClients &&
      cachedVersion === version &&
      now - cachedAt < CACHE_TTL_MS
    ) {
      return { clients: cachedClients };
    }

    try {
      const adminClient = serverSupabaseServiceRole(event);

      const { data: profiles, error } = await adminClient
        .from("profiles")
        .select(
          "slug, business_name, business_name_ar, business_name_en, logo, show_in_clients, is_demo",
        )
        .is("owner_id", null)
        .or("role.is.null,role.neq.super_admin")
        .eq("show_in_clients", true)
        .or("is_demo.is.null,is_demo.eq.false")
        .not("slug", "is", null)
        .not("logo", "is", null)
        .order("created_at", { ascending: true });

      if (error) {
        if (error.message?.includes("column") || (error as { code?: string }).code === "PGRST204") {
          console.warn("show_in_clients / is_demo columns not yet migrated on profiles.");
          return { clients: [] };
        }
        throw error;
      }

      const seenSlugs = new Set<string>();
      const featuredClients: PublicClientItem[] = [];

      for (const row of (profiles || []) as ProfileClientRow[]) {
        if (!row.show_in_clients || row.is_demo) continue;
        const slug = String(row.slug || "").trim();
        const logo = String(row.logo || "").trim();
        if (!slug || !logo || seenSlugs.has(slug)) {
          continue;
        }

        const name = String(row.business_name || "").trim();
        const nameAr = String(row.business_name_ar || "").trim();
        const nameEn = String(row.business_name_en || "").trim();
        const fallbackName = name || nameAr || nameEn || slug;

        seenSlugs.add(slug);
        featuredClients.push({
          slug,
          name: fallbackName,
          nameAr: nameAr || fallbackName,
          nameEn: nameEn || fallbackName,
          logo,
        });
      }

      cachedClients = featuredClients;
      cachedAt = now;
      cachedVersion = version;

      return { clients: featuredClients };
    } catch (err) {
      console.error("Failed to fetch public clients:", err);
      return { clients: cachedClients || [] };
    }
  },
);
