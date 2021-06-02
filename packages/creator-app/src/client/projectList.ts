import { DBProjectList, ProjectList } from '@/models';

import projectListAdapter from './adapters/projectList';
import { api } from './fetch';

export const TEAM_PATH = 'team';

const projectListClient = {
  update: (workspaceID: string, lists: ProjectList[]) =>
    api.patch(`${TEAM_PATH}/${workspaceID}/update_board`, { boards: projectListAdapter.mapToDB(lists) }),

  find: (workspaceID: string) =>
    api.get<{ boards: DBProjectList[] }>(`${TEAM_PATH}/${workspaceID}/boards`).then(({ boards }) => projectListAdapter.mapFromDB(boards)),
};

export default projectListClient;
