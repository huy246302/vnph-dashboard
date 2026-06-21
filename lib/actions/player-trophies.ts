"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/trophies`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createPlayerTrophy(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_trophies").insert({
    player_id: playerId,
    trophy_id: formData.get("trophy_id") as string,
    club_id:   str(formData.get("club_id")),
    year:      num(formData.get("year")),
    notes:     str(formData.get("notes")),
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updatePlayerTrophy(playerId: string, entryId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_trophies")
    .update({
      trophy_id: formData.get("trophy_id") as string,
      club_id:   str(formData.get("club_id")),
      year:      num(formData.get("year")),
      notes:     str(formData.get("notes")),
    })
    .eq("id", entryId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deletePlayerTrophy(playerId: string, entryId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_trophies").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}