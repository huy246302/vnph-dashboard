"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createClub(formData: FormData) {
  const supabase =createAdminClient();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const payload = {
    name,
    slug,
    short_name: formData.get("short_name") || null,
    founded_year: formData.get("founded_year") ? Number(formData.get("founded_year")) : null,
    stadium: formData.get("stadium") || null,
    league: formData.get("league") || null,
    logo_url: formData.get("logo_url") || null,
  };

  const { error } = await supabase.from("clubs").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/clubs");
}

export async function updateClub(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("clubs").update({
    name: formData.get("name"),
    short_name: formData.get("short_name") || null,
    founded_year: formData.get("founded_year") ? Number(formData.get("founded_year")) : null,
    stadium: formData.get("stadium") || null,
    league: formData.get("league") || null,
    logo_url: formData.get("logo_url") || null,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/clubs");
}

export async function deleteClub(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("clubs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/clubs");
}