import { createClient } from "@/lib/supabase-server";

export async function getPlayerStatsCards(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_stats_card")
    .select("*")
    .eq("player_id", playerId)
    .order("year_from", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStatsCardById(cardId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_stats_card")
    .select("*")
    .eq("id", cardId)
    .single();
  if (error) return null;
  return data;
}