import { createClient } from "@/lib/supabase-server";

export async function getPlayerNationalTeams(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_national_team")
    .select(`
      id, player_id, national_team_id, caps, goals, debut_date, last_match_date,
      national_teams ( id, name, short_name, country )
    `)
    .eq("player_id", playerId)
    .order("debut_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getNationalTeamsForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("national_teams")
    .select("id, name, short_name")
    .order("name");
  if (error) throw error;
  return data;
}