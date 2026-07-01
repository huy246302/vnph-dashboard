import { createAdminClient } from "@/lib/supabase-admin";

export async function getPlayerNicknames(playerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("player_nicknames")
    .select("id, nickname")
    .eq("player_id", playerId)
    .order("nickname");
  if (error) throw error;
  return data;
}