"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createProfile(formData: FormData) {
  const supabase = createAdminClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Step 1: create the auth user first.
  // NOTE: this fires the `on_auth_user_created` trigger, which already
  // inserts a matching `profiles` row (status defaults to 'pending').
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) throw new Error(authError.message);

  // Step 2: fill in/overwrite the profile fields the admin actually typed,
  // and mark it 'approved' since an admin is creating this account directly.
  // Use update (not insert) — the trigger already created the row.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      username: formData.get("username") || null,
      full_name: formData.get("full_name") || null,
      avatar_url: formData.get("avatar_url") || null,
      role: formData.get("role") || "user",
      status: "approved",
    })
    .eq("id", authData.user.id);

  if (profileError) throw new Error(profileError.message);
  revalidatePath("/dashboard/profiles");
}

export async function updateProfile(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      username: formData.get("username") || null,
      full_name: formData.get("full_name") || null,
      avatar_url: formData.get("avatar_url") || null,
      role: formData.get("role") || "user",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/profiles");
}

export async function deleteProfile(id: string) {
  const supabase = createAdminClient();
  // delete auth user which cascades to profile
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/profiles");
}

// ── Allowlist actions ──

export async function approveProfile(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/profiles");
}

export async function blockProfile(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "blocked" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/profiles");
}

export async function setProfileRole(id: string, role: "admin" | "user") {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/profiles");
}