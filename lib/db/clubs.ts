import { createClient } from "@/lib/supabase-server";

export async function getClubs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("id, name, short_name, league, stadium, founded_year, logo_url")
    .order("name");
  if (error) throw error;
  return data;
}