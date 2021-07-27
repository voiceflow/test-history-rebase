import { ExtraOptions } from './types';

export interface VersionClient {
  canRead: (creatorID: number, versionID: string) => Promise<boolean>;
}

const Client = ({ axiosClient }: ExtraOptions): VersionClient => ({
  canRead: (creatorID: number, versionID: string) =>
    axiosClient
      .head(`/v2/user/${creatorID}/versions/${versionID}`)
      .then(() => true)
      .catch(() => false),
});

export default Client;
