import { connectSupabaseProject } from './connectSupabaseProject';
import { createSupabaseProject } from './createSupabaseProject';

export const createAndConnectSupabaseProject = async (name: string) => {
  createSupabaseProject(name);
  await connectSupabaseProject(name);
};
