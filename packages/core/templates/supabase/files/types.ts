export type * from './types.gen';
export interface CookieStore {
  get(name: string): { value: string } | undefined;
  set(options: { name: string; value: string }): void;
  delete(name: string): void;
}
