"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createClub(formData: FormData) {
  const supabase = await createClient();

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