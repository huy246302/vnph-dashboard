import { createClient } from "@/lib/supabase-server";

export async function getPlayerMedia(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_media")
    .select("id, player_id, image_url, caption, year, media_type")
    .eq("player_id", playerId)
    .order("year", { ascending: false });
  if (error) throw error;
  return data;
}