import { createClient } from "@/lib/supabase-client";

export async function getDashboardStats() {
  const supabase = await createClient();
  const [players, clubs] = await Promise.all([
    supabase.from("players").select("*", { count: "exact", head: true }),
    supabase.from("clubs").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalPlayers: players.count || 0,
    totalClubs: clubs.count || 0,
  };
}