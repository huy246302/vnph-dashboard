"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function num(val: FormDataEntryValue | null) {
  return val ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createPlayer(formData: FormData) {
  const supabase = createAdminClient();
  const full_name = formData.get("full_name") as string;

  const { error } = await supabase.from("players").insert({
    full_name,
    slug:               toSlug(full_name),
    short_name:         str(formData.get("short_name")),
    birth_date:         str(formData.get("birth_date")),
    birth_place:        str(formData.get("birth_place")),
    nationality:        str(formData.get("nationality")) ?? "Việt Nam",
    position:           str(formData.get("position")),
    height_cm:          num(formData.get("height_cm")),
    weight_kg:          num(formData.get("weight_kg")),
    preferred_foot:     str(formData.get("preferred_foot")),
    primary_era:        str(formData.get("primary_era")),
    career_start_year:  num(formData.get("career_start_year")),
    career_end_year:    num(formData.get("career_end_year")),
    is_retired:         formData.get("is_retired") === "true",
    retired_year:       num(formData.get("retired_year")),
    bio:                str(formData.get("bio")),
    legacy_bio:         str(formData.get("legacy_bio")),
    playing_style:      str(formData.get("playing_style")),
    profile_image_url:  str(formData.get("profile_image_url")),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/players");
}

export async function updatePlayer(id: string, formData: FormData) {
  const supabase = createAdminClient();
  const full_name = formData.get("full_name") as string;

  const { error } = await supabase
    .from("players")
    .update({
      full_name,
      slug:               toSlug(full_name),
      short_name:         str(formData.get("short_name")),
      birth_date:         str(formData.get("birth_date")),
      birth_place:        str(formData.get("birth_place")),
      nationality:        str(formData.get("nationality")) ?? "Việt Nam",
      position:           str(formData.get("position")),
      height_cm:          num(formData.get("height_cm")),
      weight_kg:          num(formData.get("weight_kg")),
      preferred_foot:     str(formData.get("preferred_foot")),
      primary_era:        str(formData.get("primary_era")),
      career_start_year:  num(formData.get("career_start_year")),
      career_end_year:    num(formData.get("career_end_year")),
      is_retired:         formData.get("is_retired") === "true",
      retired_year:       num(formData.get("retired_year")),
      bio:                str(formData.get("bio")),
      legacy_bio:         str(formData.get("legacy_bio")),
      playing_style:      str(formData.get("playing_style")),
      profile_image_url:  str(formData.get("profile_image_url")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/players");
  revalidatePath(`/dashboard/players/${id}/edit`);
}

export async function deletePlayer(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/players");
}