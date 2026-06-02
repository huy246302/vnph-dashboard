import { createClient } from "@/lib/supabase-server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const [players, clubs, profiles] = await Promise.all([
    supabase.from("players").select("*", { count: "exact", head: true }),
    supabase.from("clubs").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalPlayers: players.count || 0,
    totalClubs: clubs.count || 0,
    totalProfiles: profiles.count || 0,
  };
}