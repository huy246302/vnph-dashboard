"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ATTRIBUTE_FIELDS = [
  // Technical
  "corners","crossing","dribbling","finishing","first_touch",
  "free_kick_taking","heading","long_shots","long_throws","marking",
  "passing","penalty_taking","tackling","technique",
  // Mental
  "aggression","anticipation","bravery","composure","concentration",
  "decisions","determination","flair","leadership","off_the_ball",
  "positioning","teamwork","vision","work_rate",
  // Physical
  "acceleration","agility","balance","jumping_reach",
  "natural_fitness","pace","stamina","strength",
  // Goalkeeping
  "gk_aerial_reach","gk_command_of_area","gk_communication","gk_eccentricity",
  "gk_first_touch","gk_handling","gk_kicking","gk_one_on_ones",
  "gk_passing","gk_tendency_to_punch","gk_reflexes","gk_rushing_out","gk_throwing",
] as const;

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

function buildAttributePayload(formData: FormData) {
  const payload: Record<string, number | null> = {};
  for (const field of ATTRIBUTE_FIELDS) {
    payload[field] = num(formData.get(field));
  }
  return payload;
}

export async function createStatsCard(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_stats_card").insert({
    player_id:   playerId,
    era_label:   str(formData.get("era_label")),
    year_from:   num(formData.get("year_from")),
    year_to:     num(formData.get("year_to")),
    is_verified: formData.get("is_verified") === "true",
    notes:       str(formData.get("notes")),
    ...buildAttributePayload(formData),
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/players/${playerId}/stats-cards`);
  redirect(`/dashboard/players/${playerId}/stats-cards`);
}

export async function updateStatsCard(playerId: string, cardId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_stats_card")
    .update({
      era_label:   str(formData.get("era_label")),
      year_from:   num(formData.get("year_from")),
      year_to:     num(formData.get("year_to")),
      is_verified: formData.get("is_verified") === "true",
      notes:       str(formData.get("notes")),
      ...buildAttributePayload(formData),
    })
    .eq("id", cardId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/players/${playerId}/stats-cards`);
  redirect(`/dashboard/players/${playerId}/stats-cards`);
}

export async function deleteStatsCard(playerId: string, cardId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_stats_card").delete().eq("id", cardId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/players/${playerId}/stats-cards`);
}