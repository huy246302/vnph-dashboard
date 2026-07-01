import { createAdminClient } from "@/lib/supabase-admin";

export async function getNationalTeams() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("national_teams")
    .select("id, name, short_name, country, logo_url")
    .order("name");
  if (error) throw error;
  return data;
}