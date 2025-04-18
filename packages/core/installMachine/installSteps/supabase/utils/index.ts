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
    const [linked, org_id, refId, name, region, created_at] = line.split('|').map((item) => item.trim());
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

  const tokens: { anon: string; service_role: string } = { anon: '', service_role: '' };

  lines.forEach((line) => {
    if (line.includes('|')) {
      const [key, value] = line.split('|').map((s) => s.trim());
      if (key === 'anon' || key === 'service_role') {
        tokens[key] = value;
      }
    }
  });

  return {
    anonKey: tokens.anon,
    serviceRoleKey: tokens.service_role,
  };
};
