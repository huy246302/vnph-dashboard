"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createTrophy(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("trophies").insert({
    name:        formData.get("name") as string,
    short_name:  formData.get("short_name") || null,
    description: formData.get("description") || null,
    level:       formData.get("level") || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/trophies");
}

export async function updateTrophy(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("trophies")
    .update({
      name:        formData.get("name") as string,
      short_name:  formData.get("short_name") || null,
      description: formData.get("description") || null,
      level:       formData.get("level") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/trophies");
}

export async function deleteTrophy(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("trophies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/trophies");
}