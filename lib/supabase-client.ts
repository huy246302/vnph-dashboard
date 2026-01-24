import { createClient } from "@supabase/supabase-js";

// lib/supabase-client.ts (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
