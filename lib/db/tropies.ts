import { createClient } from "@/lib/supabase-server";

export async function getTrophies() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trophies")
    .select("id, name, short_name, description, level")
    .order("name");
  if (error) throw error;
  return data;
}