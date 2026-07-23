import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { origin } = new URL(request.url);

  const { data: qr } = await supabase.from("qr_codes").select("*").eq("slug", slug).maybeSingle();
  if (!qr) return NextResponse.redirect(origin);

  const { data: apartment } = await supabase
    .from("apartments")
    .select("slug")
    .eq("id", qr.apartment_id)
    .maybeSingle();
  if (!apartment) return NextResponse.redirect(origin);

  let destination = `/g/${apartment.slug}`;

  if (qr.target_type === "room") {
    destination = `/g/${apartment.slug}/rooms/${qr.target_id}`;
  } else if (qr.target_type === "room_item") {
    const { data: item } = await supabase
      .from("room_items")
      .select("room_id")
      .eq("id", qr.target_id)
      .maybeSingle();
    destination = item
      ? `/g/${apartment.slug}/rooms/${item.room_id}?item=${qr.target_id}`
      : `/g/${apartment.slug}`;
  } else if (qr.target_type === "guide_section") {
    const { data: section } = await supabase
      .from("guide_sections")
      .select("key, view_count")
      .eq("id", qr.target_id)
      .maybeSingle();
    if (section) {
      await supabase
        .from("guide_sections")
        .update({ view_count: section.view_count + 1 })
        .eq("id", qr.target_id);
    }
    destination = section ? `/g/${apartment.slug}#${section.key}` : `/g/${apartment.slug}`;
  }

  await supabase.from("qr_scans").insert({
    qr_code_id: qr.id,
    user_agent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  });
  await supabase.from("qr_codes").update({ scan_count: qr.scan_count + 1 }).eq("id", qr.id);

  return NextResponse.redirect(`${origin}${destination}`);
}
