"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function createNationalTeam(formData: FormData) {
  const supabase = createAdminClient();
  const name = formData.get("name") as string;

  const { error } = await supabase.from("national_teams").insert({
    name,
    slug:       toSlug(name),
    short_name: formData.get("short_name") || null,
    country:    formData.get("country") as string,
    logo_url:   formData.get("logo_url") || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/national-teams");
}

export async function updateNationalTeam(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const name = formData.get("name") as string;

  const { error } = await supabase
    .from("national_teams")
    .update({
      name,
      slug:       toSlug(name),
      short_name: formData.get("short_name") || null,
      country:    formData.get("country") as string,
      logo_url:   formData.get("logo_url") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/national-teams");
}

export async function deleteNationalTeam(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("national_teams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/national-teams");
}