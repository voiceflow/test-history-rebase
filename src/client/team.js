import boardAdapter from './adapters/board';
import memberAdapter from './adapters/member';
import projectAdapter from './adapters/project';
import fetch from './fetch';

const TEAMS_PATH = 'teams';
const TEAM_PATH = 'team';

const teamClient = {
  find: () => fetch(TEAMS_PATH),

  findMembers: (teamID) => fetch(`${TEAM_PATH}/${teamID}/members`).then(memberAdapter.mapFromDB),

  findBoards: (teamID) => fetch(`${TEAM_PATH}/${teamID}/boards`).then(({ boards }) => boardAdapter.mapFromDB(boards)),

  updateBoards: (teamID, boards) => fetch.patch(`${TEAM_PATH}/${teamID}/update_board`, { boards: boardAdapter.mapToDB(boards) }),

  findProjects: (teamID) => fetch(`${TEAM_PATH}/${teamID}/projects`).then(projectAdapter.mapFromDB),
};

export default teamClient;
