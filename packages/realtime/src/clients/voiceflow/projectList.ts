import * as Realtime from '@voiceflow/realtime-sdk';

import { ExtraOptions } from './types';

export interface ProjectListClient {
  getAll: (workspaceID: string) => Promise<Realtime.DBProjectList[]>;

  updateAll: (workspaceID: string, lists: Realtime.DBProjectList[]) => Promise<void>;
}

const Client = ({ axiosClient }: ExtraOptions): ProjectListClient => ({
  getAll: (workspaceID: string) =>
    axiosClient.get<{ boards: Realtime.DBProjectList[] }>(`/team/${workspaceID}/boards`).then(({ data }) => data.boards),

  updateAll: (workspaceID: string, lists: Realtime.DBProjectList[]) => axiosClient.patch(`/team/${workspaceID}/update_board`, { boards: lists }),
});

export default Client;
