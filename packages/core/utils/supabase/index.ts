import { connectSupabaseProject } from './connectProject';
import { createSupabaseProject } from './createProject';

export const createAndConnectSupabaseProject = async (name: string) => {
  createSupabaseProject(name);
  await connectSupabaseProject(name);
};
