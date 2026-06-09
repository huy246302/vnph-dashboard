import { createClient } from "@/lib/supabase-server";

export async function getAwards() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("awards")
    .select("id, name, short_name, description, scope")
    .order("name");
  if (error) throw error;
  return data;
}