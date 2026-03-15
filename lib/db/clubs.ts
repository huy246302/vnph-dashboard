import { supabase } from "@/lib/supabase-client";

export async function getClubs() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*");

  if (error) throw error;

  return data;
}