import { createAdminClient } from "@/lib/supabase-admin";

export async function getPlayers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("full_name");
  if (error) throw error;
  return data;
}

export async function getPlayerById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}