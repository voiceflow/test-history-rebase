import axios from 'axios';
import Normalize, { unnormalize } from 'ducks/_normalize';
import { setError } from 'ducks/modal';
import { fetchProjects } from 'ducks/project';
import update from 'immutability-helper';
import _ from 'lodash';
import randomstring from 'randomstring';

import { deleteProject } from './project';

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

const Boards = new Normalize('board_id', 'board', updateBoards);

export const resetBoards = () => ({
  type: 'RESET_BOARDS',
});

export const fetchBoards = (team_id) => {
  return async (dispatch, getState) => {
    dispatch(resetBoards());
    if (!team_id) return;

    try {
      let url = '/boards';
      if (team_id !== -1) url = `/team/${team_id}/boards`;
      const boards = (await axios.get(url)).data.boards;

      // get the projects on this board
      await dispatch(fetchProjects(team_id));

      // determine if there are any projects not on a board
      let board_projects = [];
      _.forEach(boards, (board) => {
        // eslint-disable-next-line no-return-assign
        if (!Array.isArray(board.projects)) return (board.projects = []);
        board_projects.push(...board.projects);
      });
      board_projects = new Set(board_projects);
      const projects = getState().project.allIds;
      const unsorted_projects = projects.filter((p) => !board_projects.has(p));

      if (unsorted_projects.length > 0) {
        boards.push({
          board_id: randomstring.generate(10),
          name: 'Default List',
          projects: unsorted_projects,
        });
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

      return Promise.resolve();
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to retrieve boards'));
    }
  };
};

export const updateLists = (team_id) => async (dispatch, getState) => {
  try {
    const boards = getState().board;
    const boards_array = unnormalize(boards);

    if (boards.save === JSON.stringify(boards_array)) return;

    await axios.patch(`/team/${team_id}/update_board`, {
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

export const addBoard = (team_id) => {
  return async (dispatch) => {
    const current_id = randomstring.generate(10);
    try {
      const empty_board = {
        board_id: current_id,
        name: 'New List',
        projects: [],
      };
      dispatch(
        Boards.add({
          data: empty_board,
        })
      );
      dispatch(updateLists(team_id));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to add board'));
      return Promise.reject();
    }
    return Promise.resolve(current_id);
  };
};

export const addProjectToList = (board_id, project_id) => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      const team_id = getState().team.team_id;
      let board = boards.byId[board_id];
      if (!board) throw new Error();

      board = update(board, {
        projects: {
          $push: [project_id],
        },
      });
      dispatch(
        Boards.update({
          id: board_id,
          data: board,
        })
      );
      if (team_id) dispatch(updateLists(team_id));
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

        const team_id = getState().team.team_id;
        if (team_id) dispatch(updateLists(team_id));
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
      const team_id = getState().team.team_id;
      const boards = getState().board;
      const board = boards.byId[board_id];
      _.forEach(board.projects, (project) => dispatch(deleteProject(project)));
      dispatch(
        Boards.delete({
          id: board_id,
        })
      );
      if (team_id) dispatch(updateLists(team_id));
    } catch (err) {
      dispatch(setError('Problem Deleting List'));
      console.error(err);
    }
  };
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
