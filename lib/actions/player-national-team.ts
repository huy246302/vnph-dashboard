"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/national-team`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createPlayerNationalTeam(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_national_team").insert({
    player_id:        playerId,
    national_team_id: formData.get("national_team_id") as string,
    caps:             num(formData.get("caps")) ?? 0,
    goals:            num(formData.get("goals")) ?? 0,
    debut_date:       str(formData.get("debut_date")),
    last_match_date:  str(formData.get("last_match_date")),
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updatePlayerNationalTeam(playerId: string, entryId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_national_team")
    .update({
      national_team_id: formData.get("national_team_id") as string,
      caps:             num(formData.get("caps")) ?? 0,
      goals:            num(formData.get("goals")) ?? 0,
      debut_date:       str(formData.get("debut_date")),
      last_match_date:  str(formData.get("last_match_date")),
    })
    .eq("id", entryId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deletePlayerNationalTeam(playerId: string, entryId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_national_team").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}