import { createClient } from "@/lib/supabase-server";

export async function getPlayers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*");

  if (error) throw error;
  console.log(data); // ← check your terminal output
  return data;
}