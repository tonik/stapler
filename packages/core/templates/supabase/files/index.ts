import type * as supabase from "@supabase/supabase-js";

import type { Database } from "./types";

export type { CookieStore } from "./types";
export type Session = supabase.Session;
export type SupabaseClient = supabase.SupabaseClient<Database>;
export type User = supabase.User;
export type { Database };
