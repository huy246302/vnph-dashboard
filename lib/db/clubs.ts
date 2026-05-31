import { createClient } from "@/lib/supabase-client";

export async function getClubs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}