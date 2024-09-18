import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

interface CreateClientOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const createClient = ({
  supabaseUrl,
  supabaseAnonKey,
}: CreateClientOptions) =>
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
