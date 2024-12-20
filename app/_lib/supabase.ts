import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string,
);
