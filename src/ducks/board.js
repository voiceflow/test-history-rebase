import axios from "axios";
import _ from "lodash";
import { setError } from "ducks/modal";
import Normalize, { unnormalize } from "ducks/_normalize";
import { deleteProject } from "./project";
import update from "immutability-helper";

const initialState = {
  byId: {},
  allIds: []
};

export default function boardReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_BOARDS":
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds
      };
    case "RESET_BOARDS":
      return {
        ...state,
        byId: {},
        allIds: []
      };
    default:
      return state;
  }
}

export const updateBoards = ({ byId, allIds }) => ({
  type: "UPDATE_BOARDS",
  payload: { byId, allIds }
});

const Boards = new Normalize("board_id", "board", updateBoards);

export const resetBoards = () => ({
  type: "RESET_BOARDS"
});

export const fetchBoards = team_id => {
  return async dispatch => {
    dispatch(resetBoards());
    if (!team_id) return;

    try {
      let url = `/boards`;
      if (team_id !== -1) url = `/team/${team_id}/boards`;
      let boards = (await axios.get(url)).data.boards;
      // NORMALIZE
      dispatch(Boards.create({ data: boards }));
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      dispatch(setError("Unable to retrieve boards"));
    }
  };
};

export const addBoard = team_id => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      const max = _.max(boards.allIds);
      const current_id = _.isUndefined(max) ? 1 : max + 1;
      let empty_board = {
        board_id: current_id,
        name: `New List ${current_id}`,
        projects: []
      };
      dispatch(Boards.add({ data: empty_board }));
      dispatch(updateLists(team_id));
    } catch (err) {
      console.error(err);
      dispatch(setError("Unable to add board"));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const addProjectToList = (board_id, project_id) => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      const team_id = getState().team.team_id;
      let board = boards.byId[board_id];
      if (!board) throw new Error();

      board = update(board, { projects: { $push: [project_id] } });
      dispatch(Boards.update({ id: board_id, data: board }));
      if (team_id) dispatch(updateLists(team_id));
    } catch (err) {
      console.error(err);
      dispatch(setError("Unable to add project to list"));
    }
  };
};

export const renameList = (board_id, new_name) => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      const team_id = getState().team.team_id;

      let board;
      if (!board_id) {
        board_id = "initial";
      }
      board = boards.byId[board_id];
      if (board) {
        board = update(board, { name: { $set: new_name } });
        dispatch(Boards.update({ id: board_id, data: board }));
      } else {
        let data = { board_id: "initial" };
        data = update(data, { name: { $set: new_name } });
        dispatch(Boards.add({ data: data }));
      }
      if (team_id) dispatch(updateLists(team_id));
    } catch (err) {
      console.error(err);
      dispatch(setError("Error renaming list"));
    }
  };
};

export const updateLists = team_id => {
  return async (dispatch, getState) => {
    try {
      const boards = getState().board;
      await axios.patch(`/team/${team_id}/update_board`, {
        boards: unnormalize(boards)
      });
    } catch (err) {
      console.error(err);
      // dispatch(setError("Unable to update lists"));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};
export const deleteBoard = board_id => {
  return async (dispatch, getState) => {
    try {
      const team_id = getState().team.team_id;
      const boards = getState().board;
      let board = boards.byId[board_id];
      _.forEach(board.projects, project => dispatch(deleteProject(project)));
      dispatch(Boards.delete({ id: board_id }));
      if (team_id) dispatch(updateLists(team_id));
    } catch (err) {
      dispatch(setError("Problem Deleting List"));
      console.error(err);
    }
  };
};
