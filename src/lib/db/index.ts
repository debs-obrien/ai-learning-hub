import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
    "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your .env.local file."
  );
}

// Create a single instance of the Supabase client
// Using 'any' for the generic type to avoid strict typing issues with insert/update
// The actual data structure is validated by the database constraints
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
