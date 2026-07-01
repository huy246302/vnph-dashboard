import { createAdminClient } from "@/lib/supabase-admin";

export async function getAwards() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("awards")
    .select("id, name, short_name, description, scope")
    .order("name");
  if (error) throw error;
  return data;
}