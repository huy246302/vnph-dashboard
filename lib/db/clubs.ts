import { supabase } from "@/lib/supabase-client";

export async function getClubs() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}