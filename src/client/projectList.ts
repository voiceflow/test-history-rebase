import { DBProjectList, ProjectList } from '@/models';

import projectListAdapter from './adapters/projectList';
import fetch from './fetch';

export const TEAM_PATH = 'team';

const projectListClient = {
  update: (workspaceID: string, lists: ProjectList[]) =>
    fetch.patch(`${TEAM_PATH}/${workspaceID}/update_board`, { boards: projectListAdapter.mapToDB(lists) }),

  find: (workspaceID: string) =>
    fetch.get<{ boards: DBProjectList[] }>(`${TEAM_PATH}/${workspaceID}/boards`).then(({ boards }) => projectListAdapter.mapFromDB(boards)),
};

export default projectListClient;
