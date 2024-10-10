import type { CookieOptions } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import type { Database } from './types';

interface CreateMiddlewareOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const createMiddleware = ({ supabaseAnonKey, supabaseUrl }: CreateMiddlewareOptions) =>
  async function middleware(request: NextRequest) {
    const cookiesToSet: {
      name: string;
      value: string;
    }[] = [];

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          const cookieValue = request.cookies.get(name)?.value;
          return cookieValue;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });

          cookiesToSet.push({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });

          cookiesToSet.push({
            name,
            value: '',
            ...options,
          });
        },
      },
    });

    const { data } = await supabase.auth.getUser();

    return { user: data.user, cookiesToSet };
  };
