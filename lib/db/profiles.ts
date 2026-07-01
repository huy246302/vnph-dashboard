import { createAdminClient } from "@/lib/supabase-admin";

export async function getProfiles() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}