import { supabase } from "@/lib/supabase-client";

export default async function TestPage() {
  const { data } = await supabase
    .from("clubs")
    .select("*");

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}