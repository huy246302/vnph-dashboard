"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/nicknames`);
}

export async function createNickname(playerId: string, formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_nicknames").insert({
    player_id: playerId,
    nickname:  formData.get("nickname") as string,
  });
  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updateNickname(playerId: string, id: string, formData: FormData) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("player_nicknames")
    .update({ nickname: formData.get("nickname") as string })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deleteNickname(playerId: string, id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_nicknames").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}