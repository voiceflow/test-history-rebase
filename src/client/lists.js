import fetch from './fetch';

const LISTS_PATH = 'team';

const listClient = {
  update: (teamID, data) => fetch.patch(`${LISTS_PATH}/${teamID}/update_board`, data),

  // findBoards: (workspaceId) => fetch(`${LISTS_PATH}/${workspaceId}/boards`).then(({ boards }) => listAdapter.mapFromDB(boards)),
  // updateBoards: (workspaceId, boards) => fetch.patch(`${LISTS_PATH}/${workspaceId}/update_board`, { boards: listAdapter.mapToDB(boards) }),
};

export default listClient;
