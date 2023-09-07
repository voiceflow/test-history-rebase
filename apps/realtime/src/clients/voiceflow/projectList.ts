import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface ProjectListClient {
  getAll: (workspaceID: string) => Promise<Realtime.DBProjectList[]>;

  replaceAll: (workspaceID: string, lists: Realtime.DBProjectList[]) => Promise<void>;
}

const Client = ({ api }: ExtraOptions): ProjectListClient => ({
  getAll: (workspaceID) =>
    api
      .get<{ projectLists: Realtime.DBProjectList[] }>(`/team/${workspaceID}/projectLists`)
      .then(({ data }) => data.projectLists.map(({ projects = [], ...projectList }) => ({ projects, ...projectList }))),

  replaceAll: (workspaceID, projectLists) => api.patch(`/team/${workspaceID}/projectLists`, { projectLists }),
});

export default Client;
