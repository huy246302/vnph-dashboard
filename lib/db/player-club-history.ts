import { createAdminClient } from "@/lib/supabase-admin";

export async function getPlayerClubHistory(playerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("player_club_history")
    .select(`
      id, player_id, club_id, jersey_number, joined_at, left_at,
      transfer_fee, is_loan, appearances, goals, assists, is_captain, notes,
      clubs ( id, name, short_name, logo_url )
    `)
    .eq("player_id", playerId)
    .order("joined_at", { ascending: false });
  if (error) throw error;
  return data;
}