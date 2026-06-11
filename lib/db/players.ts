import { createClient } from "@/lib/supabase-server";

export async function getPlayers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("full_name");
  if (error) throw error;
  return data;
}

export async function getPlayerById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}