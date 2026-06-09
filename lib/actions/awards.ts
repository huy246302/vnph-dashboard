"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createAward(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("awards").insert({
    name:        formData.get("name") as string,
    short_name:  formData.get("short_name") || null,
    description: formData.get("description") || null,
    scope:       formData.get("scope") || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/awards");
}

export async function updateAward(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("awards")
    .update({
      name:        formData.get("name") as string,
      short_name:  formData.get("short_name") || null,
      description: formData.get("description") || null,
      scope:       formData.get("scope") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/awards");
}

export async function deleteAward(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("awards").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/awards");
}