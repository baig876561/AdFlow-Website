import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Sidebar } from "@/components/sidebar";
import type { UserRole } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminSupabase = createAdminClient();
  const { data: userData } = await adminSupabase
    .from("users")
    .select("role, name")
    .eq("id", user.id)
    .single();

  const role = (userData?.role || "client") as UserRole;
  const userName = userData?.name || user.email || "User";

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
