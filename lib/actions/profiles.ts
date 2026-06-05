"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createProfile(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    id: formData.get("id") as string,
    username: formData.get("username") || null,
    full_name: formData.get("full_name") || null,
    avatar_url: formData.get("avatar_url") || null,
    role: formData.get("role") || "user",
  };

  const { error } = await supabase.from("profiles").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/profiles");
}