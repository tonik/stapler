interface SupabaseProjectInfo {
  linked: boolean;
  org_id: string;
  id: string;
  name: string;
  region: string;
  created_at: string;
}

export function parseProjectsList(output: string): SupabaseProjectInfo[] {
  const lines = output.trim().split('\n');
  lines.splice(0, 2);

  return lines.map((line) => {
    const [linked, org_id, id, name, region, created_at] = line.split('│').map((item) => item.trim());
    return {
      linked: linked !== '',
      org_id,
      id,
      name,
      region,
      created_at,
    };
  });
}

export function getAnonKey(input: string) {
  const lines = input.split('\n');

  const anonLine = lines.find((line) => line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').includes('anon'));

  return anonLine?.split('│')[1].trim();
}
