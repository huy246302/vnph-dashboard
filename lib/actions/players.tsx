"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createPlayer(formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string;
  const slug = full_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const payload = {
    full_name,
    slug,
    short_name: formData.get("short_name") || null,
    birth_date: formData.get("birth_date") || null,
    nationality: formData.get("nationality") || "Việt Nam",
    position: formData.get("position") || null,
    height_cm: formData.get("height_cm") ? Number(formData.get("height_cm")) : null,
    preferred_foot: formData.get("preferred_foot") || null,
    current_club: formData.get("current_club") || null,
    club_jersey_number: formData.get("club_jersey_number") ? Number(formData.get("club_jersey_number")) : null,
    bio: formData.get("bio") || null,
  };

  const { error } = await supabase.from("players").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/players");
}