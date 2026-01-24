import { createClient } from "@supabase/supabase-js";

// lib/supabase-server.ts
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
