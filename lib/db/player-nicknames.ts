import { createClient } from "@/lib/supabase-server";

export async function getPlayerNicknames(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_nicknames")
    .select("id, nickname")
    .eq("player_id", playerId)
    .order("nickname");
  if (error) throw error;
  return data;
}