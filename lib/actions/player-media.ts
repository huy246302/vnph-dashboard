"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

function revalidate(playerId: string) {
  revalidatePath(`/dashboard/players/${playerId}/media`);
}

function num(val: FormDataEntryValue | null) {
  return val && val !== "" ? Number(val) : null;
}

function str(val: FormDataEntryValue | null) {
  return val?.toString().trim() || null;
}

export async function createPlayerMedia(playerId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("player_media").insert({
    player_id:  playerId,
    image_url:  formData.get("image_url") as string,
    caption:    str(formData.get("caption")),
    year:       num(formData.get("year")),
    media_type: str(formData.get("media_type")) ?? "photo",
  });

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function updatePlayerMedia(playerId: string, mediaId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("player_media")
    .update({
      image_url:  formData.get("image_url") as string,
      caption:    str(formData.get("caption")),
      year:       num(formData.get("year")),
      media_type: str(formData.get("media_type")) ?? "photo",
    })
    .eq("id", mediaId);

  if (error) throw new Error(error.message);
  revalidate(playerId);
}

export async function deletePlayerMedia(playerId: string, mediaId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("player_media").delete().eq("id", mediaId);
  if (error) throw new Error(error.message);
  revalidate(playerId);
}