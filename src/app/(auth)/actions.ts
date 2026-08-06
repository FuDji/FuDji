"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ROLE_HOME } from "@/lib/constants";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  acceptInviteSchema,
} from "@/lib/validations";

export type FormState = { error?: string; success?: boolean } | undefined;

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Pogrešan email ili lozinka." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect((profile && ROLE_HOME[profile.role]) || "/app");
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: error.message };

  return { success: true };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  redirect((profile && ROLE_HOME[profile.role]) || "/app");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Accepts an email invitation: validates the token server-side with the
 * admin client (bypassing RLS, since the invitee has no session yet),
 * creates their auth user + sets their password, then promotes their
 * profile row to the invited role/company/restaurant.
 */
export async function acceptInvite(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = acceptInviteSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Neispravan unos" };
  }

  const admin = createAdminClient();

  const { data: invite, error: inviteError } = await admin
    .from("invitations")
    .select("*")
    .eq("token", parsed.data.token)
    .eq("status", "pending")
    .single();

  if (inviteError || !invite) {
    return { error: "Pozivnica nije pronađena ili je već iskorišćena." };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: invite.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: invite.full_name },
  });

  if (createError || !created.user) {
    return { error: createError?.message ?? "Nalog nije mogao biti kreiran." };
  }

  await admin
    .from("profiles")
    .update({
      full_name: invite.full_name,
      role: invite.role,
      company_id: invite.company_id,
      restaurant_id: invite.restaurant_id,
      daily_budget_override: invite.daily_budget_override,
    })
    .eq("id", created.user.id);

  await admin
    .from("invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: invite.email,
    password: parsed.data.password,
  });
  if (signInError) redirect("/login");

  redirect(ROLE_HOME[invite.role] ?? "/app");
}
