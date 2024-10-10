import type { CookieOptions } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';

import type { CookieStore, Database } from './types';

interface BaseOptions {
  supabaseApiUrl: string;
  /**
   * The key used to authenticate with Supabase. It can be anon key or service
   * role key depending on usage context.
   */
  supabaseKey: string;
  cookieStore?: CookieStore;
}

export function createClient(configOptions: BaseOptions) {
  return createServerClient<Database>(configOptions.supabaseApiUrl, configOptions.supabaseKey, {
    cookies: {
      get(name: string) {
        return configOptions.cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          configOptions.cookieStore?.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          configOptions.cookieStore?.set({ name, value: '', ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
