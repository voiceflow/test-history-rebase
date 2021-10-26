import client from '@/client';
import { Thunk } from '@/store/types';

export const getVersionContext =
  (versionID: string): Thunk<{ workspaceID: string; projectID: string }> =>
  async () => {
    const { projectID } = await client.api.version.get(versionID);
    const { teamID: workspaceID } = await client.api.project.get(projectID);

    return {
      workspaceID,
      projectID,
    };
  };
