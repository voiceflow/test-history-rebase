import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';
import randomstring from 'randomstring';

import Normalize, { unnormalize } from '@/ducks/_normalize';
import { setError } from '@/ducks/modal';
import { activeTeamIDSelector } from '@/ducks/team';
import { withoutValue } from '@/utils/array';

import { deleteProject, loadProjectsForTeam, projectsKeySelector } from './project';

const initialState = {
  byId: {},
  allIds: [],
  save: '',
};

export default function boardReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    case 'UPDATE_BOARD':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.boardID]: action.payload.boardValues,
        },
      };
    case 'RESET_BOARDS':
      return {
        ...state,
        byId: {},
        allIds: [],
      };
    case 'UPDATE_BOARD_SAVE':
      return {
        ...state,
        save: action.payload,
      };
    default:
      return state;
  }
}

export const updateBoards = ({ byId, allIds }) => ({
  type: 'UPDATE_BOARDS',
  payload: {
    byId,
    allIds,
  },
});

export const updateBoard = (boardID, boardValues) => ({
  type: 'UPDATE_BOARD',
  payload: {
    boardID,
    boardValues,
  },
});

const Boards = new Normalize('board_id', 'board', updateBoards);

export const resetBoards = () => ({
  type: 'RESET_BOARDS',
});

export const fetchBoards = (teamID) => async (dispatch, getState) => {
  dispatch(resetBoards());
  if (!teamID) return;

  try {
    const boards = (await axios.get(teamID !== -1 ? `/team/${teamID}/boards` : '/boards')).data.boards;

    // get the projects on this board into redux state
    await dispatch(loadProjectsForTeam(teamID));

    // master list of all projects on board
    const projects = projectsKeySelector(getState());

    // determine if there are any projects not on a board
    const usedProjects = new Set();
    boards.forEach((list) => {
      if (!Array.isArray(list.projects)) {
        list.projects = [];
      } else {
        list.projects = _.uniq(list.projects).filter((projectID) => projects.includes(projectID) && !usedProjects.has(projectID));
        list.projects.forEach((projectID) => usedProjects.add(projectID));
      }
    });

    const unusedProjects = new Set(projects.filter((projectID) => !usedProjects.has(projectID)));

    // dump all projects not used in any of the other lists
    if (unusedProjects.size > 0) {
      let defaultList = boards.find((board) => board.name === 'Default List');
      if (!defaultList) {
        defaultList = {
          board_id: randomstring.generate(10),
          name: 'Default List',
          projects: [],
        };
        boards.push(defaultList);
      }
      defaultList.projects.push(...unusedProjects);
    }

    // NORMALIZE
    dispatch(
      Boards.create({
        data: boards,
      })
    );

    dispatch({
      type: 'UPDATE_BOARD_SAVE',
      payload: JSON.stringify(unnormalize(getState().board)),
    });
  } catch (err) {
    console.error(err);
    dispatch(setError('Unable to retrieve boards'));
  }
};

export const updateLists = (teamID) => async (dispatch, getState) => {
  try {
    const boards = getState().board;
    const boards_array = unnormalize(boards);

    if (boards.save === JSON.stringify(boards_array)) return;

    await axios.patch(`/team/${teamID}/update_board`, {
      boards: boards_array,
    });

    dispatch({
      type: 'UPDATE_BOARD_SAVE',
      payload: JSON.stringify(boards_array),
    });
  } catch (err) {
    console.error(err);
    // dispatch(setError("Unable to update lists"));
    return Promise.reject();
  }
  return Promise.resolve();
};

export const addBoard = (teamID) => {
  return async (dispatch) => {
    const current_id = randomstring.generate(10);
    try {
      const empty_board = {
        board_id: current_id,
        name: 'New List',
        projects: [],
        isNew: true,
      };
      dispatch(
        Boards.add({
          data: empty_board,
        })
      );
      dispatch(updateLists(teamID));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to add board'));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const addProjectToList = (board_id, project_id) => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      const teamID = getState().team.team_id;
      let board;
      if (!board_id) {
        board = Object.values(boards.byId).filter((board) => board.name === 'Default List')[0];
        if (!board) {
          board = {
            board_id: randomstring.generate(10),
            name: 'Default List',
            projects: [],
            isNew: true,
          };
          dispatch(
            Boards.add({
              data: board,
            })
          );
        }
      } else {
        board = boards.byId[board_id];
        if (!board) throw new Error("Can't find board");
      }

      board = update(board, {
        projects: {
          $push: [project_id],
        },
      });
      dispatch(
        Boards.update({
          id: board.board_id,
          data: board,
        })
      );
      if (teamID) dispatch(updateLists(teamID));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to add project to list'));
    }
  };
};

export const renameList = (board_id, new_name) => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;

      let board = boards.byId[board_id];
      if (board) {
        board = update(board, {
          name: {
            $set: new_name,
          },
        });
        dispatch(
          Boards.update({
            id: board_id,
            data: board,
          })
        );

        const teamID = getState().team.team_id;
        if (teamID) dispatch(updateLists(teamID));
      }
    } catch (err) {
      console.error(err);
      dispatch(setError('Error renaming list'));
    }
  };
};

export const deleteBoard = (board_id) => {
  return async (dispatch, getState) => {
    try {
      const teamID = getState().team.team_id;
      const boards = getState().board;
      const board = boards.byId[board_id];
      _.forEach(board.projects, (project) => dispatch(deleteProject(project)));
      dispatch(
        Boards.delete({
          id: board_id,
        })
      );
      if (teamID) dispatch(updateLists(teamID));
    } catch (err) {
      dispatch(setError('Problem Deleting List'));
      console.error(err);
    }
  };
};

export const clearNewList = (board_id) => (dispatch, getState) => {
  const boards = getState().board;

  let board = boards.byId[board_id];
  if (board) {
    board = update(board, {
      $unset: ['isNew'],
    });
    dispatch(
      Boards.update(
        {
          id: board_id,
          data: board,
        },
        false
      )
    );
  }
};

export const changeProjectPosition = (drag, hover) => (dispatch, getState) => {
  try {
    const { id: hId, listId: hListId } = hover;
    const { id: dId, listId: dListId } = drag;
    if (hId === dId && hListId === dListId) return;

    const state = getState();
    const { projects: dProjectIds } = state.board.byId[dListId];
    const { projects: hProjectIds } = state.board.byId[hListId];

    const dIndex = dProjectIds.indexOf(dId);
    const hIndex = hProjectIds.indexOf(hId);

    if (dIndex === -1) return;

    const newDProjectIds = [...dProjectIds];

    if (hListId === dListId) {
      newDProjectIds.splice(dIndex, 1);
      newDProjectIds.splice(hIndex, 0, dProjectIds[dIndex]);
      dispatch(
        Boards.update({
          id: dListId,
          data: {
            projects: newDProjectIds,
          },
        })
      );
      return;
    }

    const newHProjectIds = [...hProjectIds];

    newDProjectIds.splice(dIndex, 1);
    newHProjectIds.splice(hIndex, 0, dProjectIds[dIndex]);

    dispatch(
      Boards.update({
        id: dListId,
        data: {
          projects: newDProjectIds,
        },
      })
    );
    dispatch(
      Boards.update({
        id: hListId,
        data: {
          projects: newHProjectIds,
        },
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export const changeListPosition = (drag, hover) => (dispatch, getState) => {
  try {
    const { id: hId } = hover;
    const { id: dId } = drag;
    if (hId === dId) return;

    const state = getState();
    const { allIds, byId } = state.board;

    const dIndex = allIds.indexOf(dId);
    const hIndex = allIds.indexOf(hId);

    if (dIndex === -1) return;
    const newAllIds = [...allIds];

    newAllIds.splice(dIndex, 1);
    newAllIds.splice(hIndex, 0, allIds[dIndex]);

    dispatch(
      updateBoards({
        byId,
        allIds: newAllIds,
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export const deleteBoardProject = (boardID, projectID) => async (dispatch, getState) => {
  const state = getState();
  const teamID = activeTeamIDSelector(state);

  const projectList = withoutValue(state.board.byId[boardID].projects, projectID);
  const updatedBoard = { ...state.board.byId[boardID], projects: projectList };

  await dispatch(deleteProject(projectID));
  await dispatch(updateBoard(boardID, updatedBoard));
  await dispatch(updateLists(teamID));
};
