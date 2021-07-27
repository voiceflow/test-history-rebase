import { ExtraOptions } from './types';

export interface ProjectClient {
  canRead: (creatorID: number, projectID: string) => Promise<boolean>;
}

const Client = ({ axiosClient }: ExtraOptions): ProjectClient => ({
  canRead: (creatorID: number, projectID: string) =>
    axiosClient
      .head(`/v2/user/${creatorID}/projects/${projectID}`)
      .then(() => true)
      .catch(() => false),
});

export default Client;
