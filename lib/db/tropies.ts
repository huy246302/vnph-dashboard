import { createAdminClient } from "@/lib/supabase-admin";

export async function getTrophies() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("trophies")
    .select("id, name, short_name, description, level")
    .order("name");
  if (error) throw error;
  return data;
}