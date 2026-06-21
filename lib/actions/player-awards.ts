"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/awards`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createPlayerAward(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_awards").insert({
    player_id: playerId,
    award_id:  formData.get("award_id") as string,
    year:      num(formData.get("year")),
    notes:     str(formData.get("notes")),
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updatePlayerAward(playerId: string, entryId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_awards")
    .update({
      award_id: formData.get("award_id") as string,
      year:     num(formData.get("year")),
      notes:    str(formData.get("notes")),
    })
    .eq("id", entryId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deletePlayerAward(playerId: string, entryId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_awards").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}