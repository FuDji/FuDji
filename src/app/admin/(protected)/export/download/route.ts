import { NextResponse, type NextRequest } from "next/server";
import * as XLSX from "xlsx";

import { requireRole } from "@/lib/auth";
import type { Order } from "@/types";

type ExportOrderRow = Order & {
  order_items: { quantity: number }[];
  company: { name: string; address: string | null; contact_phone: string | null; delivery_time: string } | null;
  restaurant: { name: string } | null;
};

export async function GET(request: NextRequest) {
  const { supabase } = await requireRole("admin");
  const date = request.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Nedostaje datum." }, { status: 400 });

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(quantity), company:companies(name, address, contact_phone, delivery_time), restaurant:restaurants(name)")
    .eq("order_date", date)
    .neq("status", "rejected")
    .returns<ExportOrderRow[]>();

  type GroupKey = string;
  const groups = new Map<
    GroupKey,
    { restaurant: string; company: string; address: string; phone: string; deliveryTime: string; meals: number }
  >();

  for (const o of orders ?? []) {
    const key = `${o.restaurant_id}::${o.company_id}`;
    const mealCount = o.order_items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
    const existing = groups.get(key);
    if (existing) {
      existing.meals += mealCount;
    } else {
      groups.set(key, {
        restaurant: o.restaurant?.name ?? "",
        company: o.company?.name ?? "",
        address: o.company?.address ?? "",
        phone: o.company?.contact_phone ?? "",
        deliveryTime: o.company?.delivery_time?.slice(0, 5) ?? "",
        meals: mealCount,
      });
    }
  }

  const rows = [...groups.values()]
    .filter((r) => r.meals > 0)
    .sort((a, b) => a.restaurant.localeCompare(b.restaurant) || a.company.localeCompare(b.company))
    .map((r) => ({
      Restoran: r.restaurant,
      Firma: r.company,
      Adresa: r.address,
      "Broj obroka": r.meals,
      "Kontakt telefon firme": r.phone,
      "Vreme dostave": r.deliveryTime,
    }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 20 }, { wch: 24 }, { wch: 30 }, { wch: 12 }, { wch: 20 }, { wch: 14 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dostava");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="prime-bite-dostava-${date}.xlsx"`,
    },
  });
}
