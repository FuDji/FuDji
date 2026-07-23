import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { buildKnowledgeBase } from "@/lib/ai/knowledge";
import { getConciergeReply } from "@/lib/ai/concierge";

const bodySchema = z.object({
  apartmentId: z.string().uuid(),
  sessionId: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { apartmentId, sessionId, message } = parsed.data;

  const supabase = await createClient();

  const { data: apartment } = await supabase
    .from("apartments")
    .select("*")
    .eq("id", apartmentId)
    .eq("status", "active")
    .maybeSingle();

  if (!apartment) {
    return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
  }

  let { data: conversation } = await supabase
    .from("ai_conversations")
    .select("id")
    .eq("apartment_id", apartmentId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!conversation) {
    const { data: created } = await supabase
      .from("ai_conversations")
      .insert({ apartment_id: apartmentId, session_id: sessionId })
      .select("id")
      .single();
    conversation = created ?? null;
  }

  if (!conversation) {
    return NextResponse.json({ error: "Could not start conversation" }, { status: 500 });
  }

  const { data: history } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true })
    .limit(10);

  const knowledgeBase = await buildKnowledgeBase(supabase, apartment);
  const reply = await getConciergeReply(knowledgeBase, apartment.name, history ?? [], message);

  await supabase.from("ai_messages").insert([
    { conversation_id: conversation.id, role: "user", content: message },
    { conversation_id: conversation.id, role: "assistant", content: reply },
  ]);

  return NextResponse.json({ reply });
}
