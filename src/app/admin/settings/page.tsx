import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { OrderWindowForm } from "@/components/admin/order-window-form";
import { CalendarRange } from "lucide-react";

export default async function AdminSettingsPage() {
  const { supabase } = await requireRole("admin");

  const { data: settings } = await supabase
    .from("platform_settings")
    .select("order_window_days")
    .eq("id", true)
    .single();

  return (
    <div>
      <PageHeader title="Podešavanja platforme" description="Globalna podešavanja za sve firme i restorane." />

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <CalendarRange className="size-4" /> Rok za naručivanje unapred
      </h2>
      <OrderWindowForm days={settings?.order_window_days ?? 7} />
    </div>
  );
}
