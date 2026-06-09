import { createClient } from "@/lib/supabase-server";

export async function getNationalTeams() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("national_teams")
    .select("id, name, short_name, country, logo_url")
    .order("name");
  if (error) throw error;
  return data;
}