import type { AxiosInstance } from 'axios';

const createResourceClient = (api: AxiosInstance, resourcePath: string) => ({
  canRead: (creatorID: number, resourceID: string) =>
    api
      .head(`/v2/user/${creatorID}/${resourcePath}/${resourceID}/read`)
      .then(() => true)
      .catch(() => false),

  canWrite: (creatorID: number, resourceID: string) =>
    api
      .head(`/v2/user/${creatorID}/${resourcePath}/${resourceID}/write`)
      .then(() => true)
      .catch(() => false),
});

export default createResourceClient;

export type ResourceClient = ReturnType<typeof createResourceClient>;
