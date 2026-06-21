import { createClient } from "@/lib/supabase-server";

export async function getPlayerAwardsList(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_awards")
    .select(`
      id, player_id, award_id, year, notes,
      awards ( id, name, short_name, scope )
    `)
    .eq("player_id", playerId)
    .order("year", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAwardsForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("awards")
    .select("id, name, short_name")
    .order("name");
  if (error) throw error;
  return data;
}