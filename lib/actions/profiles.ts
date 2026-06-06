"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createProfile(formData: FormData) {
  const supabase = createAdminClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Step 1: create the auth user first
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw new Error(authError.message);

  // Step 2: insert profile using the generated auth user id
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    username: formData.get("username") || null,
    full_name: formData.get("full_name") || null,
    avatar_url: formData.get("avatar_url") || null,
    role: formData.get("role") || "user",
  });

  if (profileError) throw new Error(profileError.message);

  revalidatePath("/dashboard/profiles");
}