import * as Realtime from '@voiceflow/realtime-sdk';

import projectListAdapter from './adapters/projectList';
import { api } from './fetch';

export const TEAM_PATH = 'team';

const projectListClient = {
  update: (workspaceID: string, lists: Realtime.ProjectList[]) =>
    api.patch(`${TEAM_PATH}/${workspaceID}/update_board`, { boards: projectListAdapter.mapToDB(lists) }),

  find: (workspaceID: string) =>
    api.get<{ boards: Realtime.DBProjectList[] }>(`${TEAM_PATH}/${workspaceID}/boards`).then(({ boards }) => projectListAdapter.mapFromDB(boards)),
};

export default projectListClient;
