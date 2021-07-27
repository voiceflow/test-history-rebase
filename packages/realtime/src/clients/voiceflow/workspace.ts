import { ExtraOptions } from './types';

export interface WorkspaceClient {
  canRead: (creatorID: number, projectID: string) => Promise<boolean>;
}

const Client = ({ axiosClient }: ExtraOptions): WorkspaceClient => ({
  canRead: (creatorID: number, workspaceID: string) =>
    axiosClient
      .head(`/v2/user/${creatorID}/workspaces/${workspaceID}`)
      .then(() => true)
      .catch(() => false),
});

export default Client;
