import { supabase } from "@/lib/supabase-client";

export async function getPlayers() {
  const { data, error } = await supabase
    .from("players")
    .select("*");

  if (error) throw error;

  return data;
}