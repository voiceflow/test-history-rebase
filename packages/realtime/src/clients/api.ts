import { AxiosStatic } from 'axios';

import { User } from '../models';
import { BaseOptions } from './types';

interface Options extends BaseOptions {
  axios: AxiosStatic;
}

const ApiClient = ({ axios, config }: Options) => {
  const client = axios.create({
    baseURL: config.CREATOR_API_ENDPOINT,
  });

  return {
    user: {
      get: (token: string) =>
        client
          .get<User | null>('/user', { headers: { authorization: token } })
          .then(({ data }) => data)
          .catch(() => null),
    },

    workspace: {
      canRead: (creatorID: number, workspaceID: string) =>
        client
          .head(`/v2/user/${creatorID}/workspaces/${workspaceID}`)
          .then(() => true)
          .catch(() => false),
    },

    project: {
      canRead: (creatorID: number, projectID: string) =>
        client
          .head(`/v2/user/${creatorID}/projects/${projectID}`)
          .then(() => true)
          .catch(() => false),
    },

    version: {
      canRead: (creatorID: number, versionID: string) =>
        client
          .head(`/v2/user/${creatorID}/versions/${versionID}`)
          .then(() => true)
          .catch(() => false),
    },

    diagram: {
      canRead: (creatorID: number, diagramID: string) =>
        client
          .head(`/v2/user/${creatorID}/diagrams/${diagramID}`)
          .then(() => true)
          .catch(() => false),
    },
  };
};

export type Api = ReturnType<typeof ApiClient>;

export default ApiClient;
