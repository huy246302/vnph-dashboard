import { createAdminClient } from "@/lib/supabase-admin";

export async function getClubs() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("id, name, short_name, league, stadium, founded_year, logo_url")
    .order("name");
  if (error) throw error;
  return data;
}

// Lightweight list for use in <select> dropdowns across player sub-resources
export async function getClubsForSelect() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("id, name, short_name")
    .order("name");
  if (error) throw error;
  return data;
}