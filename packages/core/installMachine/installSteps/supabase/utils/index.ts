interface SupabaseProjectInfo {
  linked: boolean;
  org_id: string;
  refId: string;
  name: string;
  region: string;
  created_at: string;
}

export const parseProjectsList = (output: string): SupabaseProjectInfo[] => {
  const lines = output.trim().split('\n');
  lines.splice(0, 2);

  return lines.map((line) => {
    const [linked, org_id, refId, name, region, created_at] = line.split('│').map((item) => item.trim());
    return {
      linked: linked !== '',
      org_id,
      refId,
      name,
      region,
      created_at,
    };
  });
};

export const getSupabaseKeys = (input: string) => {
  const lines = input.split('\n');

  const anonKey = lines
    .find((line) => line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').includes('anon'))
    ?.split('│')[1]
    .trim();
  const serviceRoleKey = lines
    .find((line) => line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').includes('service_role'))
    ?.split('│')[1]
    .trim();

  return {
    anonKey,
    serviceRoleKey,
  };
};
