import { createAdminClient } from "@/lib/supabase-admin";

export async function getPlayerCareerEvents(playerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("career_events")
    .select("id, player_id, event_year, event_month, title, description, event_type")
    .eq("player_id", playerId)
    .order("event_year", { ascending: false });
  if (error) throw error;
  return data;
}