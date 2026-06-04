import { createClient } from "@/lib/supabase-server";

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}