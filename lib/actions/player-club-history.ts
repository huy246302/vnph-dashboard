"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/club-history`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createClubHistoryEntry(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_club_history").insert({
    player_id:     playerId,
    club_id:       formData.get("club_id") as string,
    jersey_number: num(formData.get("jersey_number")),
    joined_at:     str(formData.get("joined_at")),
    left_at:       str(formData.get("left_at")),
    transfer_fee:  num(formData.get("transfer_fee")),
    is_loan:       formData.get("is_loan") === "true",
    appearances:   num(formData.get("appearances")) ?? 0,
    goals:         num(formData.get("goals")) ?? 0,
    assists:       num(formData.get("assists")) ?? 0,
    is_captain:    formData.get("is_captain") === "true",
    notes:         str(formData.get("notes")),
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updateClubHistoryEntry(playerId: string, entryId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_club_history")
    .update({
      club_id:       formData.get("club_id") as string,
      jersey_number: num(formData.get("jersey_number")),
      joined_at:     str(formData.get("joined_at")),
      left_at:       str(formData.get("left_at")),
      transfer_fee:  num(formData.get("transfer_fee")),
      is_loan:       formData.get("is_loan") === "true",
      appearances:   num(formData.get("appearances")) ?? 0,
      goals:         num(formData.get("goals")) ?? 0,
      assists:       num(formData.get("assists")) ?? 0,
      is_captain:    formData.get("is_captain") === "true",
      notes:         str(formData.get("notes")),
    })
    .eq("id", entryId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deleteClubHistoryEntry(playerId: string, entryId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_club_history").delete().eq("id", entryId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}