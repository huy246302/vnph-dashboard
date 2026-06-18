"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ATTRIBUTE_FIELDS = [
  "speed","acceleration","stamina","balance","jumping","heading",
  "attack","defense","aggression","reaction",
  "passing","dribbling","ball_control","technique","finishing",
  "shot_power","long_range","positioning",
  "gk_catching","gk_diving","gk_reflexes","gk_reach",
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