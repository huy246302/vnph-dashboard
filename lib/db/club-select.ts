import { createAdminClient } from "@/lib/supabase-admin";

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