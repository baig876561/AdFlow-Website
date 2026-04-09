import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const adminSupabase = createAdminClient();

    const { data: userData } = await adminSupabase
      .from("users").select("role").eq("id", user.id).single();

    if (!userData || !["admin", "super_admin"].includes(userData.role)) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Run all queries in parallel with admin client
    const [
      allAdsResult,
      activeAdsResult,
      pendingResult,
      expiredResult,
      paymentsResult,
      categoriesResult,
      citiesResult,
      healthResult,
    ] = await Promise.all([
      adminSupabase.from("ads").select("id, status, category_id, city_id, created_at", { count: "exact" }),
      adminSupabase.from("ads").select("id", { count: "exact" }).eq("status", "Published"),
      adminSupabase.from("ads").select("id", { count: "exact" }).in("status", ["Submitted", "Under Review"]),
      adminSupabase.from("ads").select("id", { count: "exact" }).eq("status", "Expired"),
      adminSupabase.from("payments").select("id, amount, status, created_at").eq("status", "verified"),
      adminSupabase.from("categories").select("id, name"),
      adminSupabase.from("cities").select("id, name"),
      adminSupabase.from("system_health_logs").select("*").order("checked_at", { ascending: false }).limit(20),
    ]);

    const allAds = allAdsResult.data || [];
    const payments = paymentsResult.data || [];
    const categories = categoriesResult.data || [];
    const cities = citiesResult.data || [];

    // Revenue
    const totalRevenue = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    // Ads by status
    const statusCounts: Record<string, number> = {};
    allAds.forEach((ad) => {
      statusCounts[ad.status] = (statusCounts[ad.status] || 0) + 1;
    });

    // Ads by category
    const catMap: Record<string, number> = {};
    allAds.forEach((ad) => {
      if (ad.category_id) catMap[ad.category_id] = (catMap[ad.category_id] || 0) + 1;
    });
    const adsByCategory = categories.map((c: any) => ({
      name: c.name,
      count: catMap[c.id] || 0,
    })).sort((a: any, b: any) => b.count - a.count);

    // Ads by city
    const cityMap: Record<string, number> = {};
    allAds.forEach((ad: any) => {
      if (ad.city_id) cityMap[ad.city_id] = (cityMap[ad.city_id] || 0) + 1;
    });
    const adsByCity = cities.map((c: any) => ({
      name: c.name,
      count: cityMap[c.id] || 0,
    })).sort((a: any, b: any) => b.count - a.count);

    // Monthly revenue (last 6 months)
    const monthlyRevenue: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      const monthPayments = payments.filter((p: any) => {
        const pd = new Date(p.created_at);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      });
      monthlyRevenue.push({
        month: monthKey,
        revenue: monthPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0),
      });
    }

    // Approval / rejection rates
    const totalReviewed = (statusCounts["Payment Pending"] || 0) + (statusCounts["Rejected"] || 0) +
      (statusCounts["Payment Submitted"] || 0) + (statusCounts["Payment Verified"] || 0) +
      (statusCounts["Published"] || 0) + (statusCounts["Scheduled"] || 0) + (statusCounts["Expired"] || 0);
    const rejected = statusCounts["Rejected"] || 0;
    const approvalRate = totalReviewed > 0 ? Math.round(((totalReviewed - rejected) / totalReviewed) * 100) : 0;

    return Response.json({
      success: true,
      data: {
        totalAds: allAdsResult.count || 0,
        activeAds: activeAdsResult.count || 0,
        pendingReviews: pendingResult.count || 0,
        expiredAds: expiredResult.count || 0,
        totalRevenue,
        verifiedPayments: payments.length,
        monthlyRevenue,
        adsByCategory,
        adsByCity,
        adsByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        approvalRate,
        rejectionRate: 100 - approvalRate,
        healthLogs: healthResult.data || [],
      },
    });
  } catch (err: any) {
    console.error("Analytics Error:", err);
    return Response.json({ success: false, error: err.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
