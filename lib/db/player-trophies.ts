import { createAdminClient } from "@/lib/supabase-admin";

export async function getPlayerTrophiesList(playerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("player_trophies")
    .select(`
      id, player_id, trophy_id, club_id, year, notes,
      trophies ( id, name, short_name, level ),
      clubs ( id, name )
    `)
    .eq("player_id", playerId)
    .order("year", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTrophiesForSelect() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("trophies")
    .select("id, name, short_name")
    .order("name");
  if (error) throw error;
  return data;
}