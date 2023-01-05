import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { ExtraOptions } from './types';

export interface ProjectListClient {
  getAll: (workspaceID: string) => Promise<Realtime.DBProjectList[]>;

  replaceAll: (workspaceID: string, lists: Realtime.DBProjectList[]) => Promise<void>;
}

const Client = ({ api }: ExtraOptions): ProjectListClient => ({
  getAll: (workspaceID) => api.get<{ boards: Realtime.DBProjectList[] }>(`/team/${workspaceID}/boards`).then(({ data }) => data.boards),

  replaceAll: (workspaceID, lists) => api.patch(`/team/${workspaceID}/update_board`, { boards: lists }),
});

export default Client;
