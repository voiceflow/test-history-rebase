import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';
import randomstring from 'randomstring';

import client from '@/client';
import Normalize, { unnormalize } from '@/ducks/_normalize';
import { setError } from '@/ducks/modal';
import { activeWorkspaceIDSelector } from '@/ducks/workspace';
import { withoutValue } from '@/utils/array';

import { deleteProject, loadProjectsForTeam, projectsKeySelector } from './project';

const initialState = {
  byId: {},
  allIds: [],
  save: '',
};

export default function listReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LISTS':
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    case 'UPDATE_LIST':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.listID]: action.payload.listValues,
        },
      };
    case 'RESET_LISTS':
      return {
        ...state,
        byId: {},
        allIds: [],
      };
    case 'UPDATE_LIST_SAVE':
      return {
        ...state,
        save: action.payload,
      };
    default:
      return state;
  }
}

export const updateBoards = ({ byId, allIds }) => ({
  type: 'UPDATE_LISTS',
  payload: {
    byId,
    allIds,
  },
});

export const updateList = (listID, listValues) => ({
  type: 'UPDATE_LIST',
  payload: {
    listID,
    listValues,
  },
});

const Lists = new Normalize('board_id', 'list', updateBoards);

export const resetLists = () => ({
  type: 'RESET_LISTS',
});

export const fetchLists = (workspaceId) => async (dispatch, getState) => {
  dispatch(resetLists());
  if (!workspaceId) return;
  try {
    const lists = (await axios.get(workspaceId !== -1 ? `/team/${workspaceId}/boards` : '/boards')).data.boards;

    await dispatch(loadProjectsForTeam(workspaceId));

    // master list of all projects on board
    const projects = projectsKeySelector(getState());

    // determine if there are any projects not on a board
    const usedProjects = new Set();
    lists.forEach((list) => {
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
      let defaultList = lists.find((list) => list.name === 'Default List');
      if (!defaultList) {
        defaultList = {
          board_id: randomstring.generate(10),
          name: 'Default List',
          projects: [],
        };
        lists.push(defaultList);
      }
      defaultList.projects.push(...unusedProjects);
    }

    // NORMALIZE
    dispatch(
      Lists.create({
        data: lists,
      })
    );

    dispatch({
      type: 'UPDATE_LIST_SAVE',
      payload: JSON.stringify(unnormalize(getState().list)),
    });
  } catch (err) {
    console.error(err);
    dispatch(setError('Unable to retrieve lists'));
  }
};

export const updateLists = (workspaceId) => async (dispatch, getState) => {
  try {
    const lists = getState().list;
    const lists_array = unnormalize(lists);

    if (lists.save === JSON.stringify(lists_array)) return;

    const payload = {
      boards: lists_array,
    };
    await client.list.update(workspaceId, payload);

    dispatch({
      type: 'UPDATE_LIST_SAVE',
      payload: JSON.stringify(lists_array),
    });
  } catch (err) {
    console.error(err);
    // dispatch(setError("Unable to update lists"));
    return Promise.reject();
  }
  return Promise.resolve();
};

export const addList = (workspaceId) => {
  return async (dispatch) => {
    const newListId = randomstring.generate(10);
    try {
      const emptyList = {
        board_id: newListId,
        name: 'New List',
        projects: [],
        isNew: true,
      };
      dispatch(
        Lists.add({
          data: emptyList,
        })
      );
      dispatch(updateLists(workspaceId));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to add list'));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const addProjectToList = (listID, project_id) => {
  return async (dispatch, getState) => {
    try {
      const lists = getState().list;
      const activeWorkspaceID = activeWorkspaceIDSelector(getState());
      let list;
      if (!listID) {
        list = Object.values(lists.byId).filter((list) => list.name === 'Default List')[0];
        if (!list) {
          list = {
            board_id: randomstring.generate(10),
            name: 'Default List',
            projects: [],
            isNew: true,
          };
          dispatch(
            Lists.add({
              data: list,
            })
          );
        }
      } else {
        list = lists.byId[listID];
        if (!list) throw new Error("Can't find list");
      }

      list = update(list, {
        projects: {
          $push: [project_id],
        },
      });
      dispatch(
        Lists.update({
          id: list.board_id,
          data: list,
        })
      );
      if (activeWorkspaceID) dispatch(updateLists(activeWorkspaceID));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to add project to list'));
    }
  };
};

export const renameList = (listID, new_name) => async (dispatch, getState) => {
  try {
    const lists = getState().list;

    let list = lists.byId[listID];
    if (list) {
      list = update(list, {
        name: {
          $set: new_name,
        },
      });
      dispatch(
        Lists.update({
          id: listID,
          data: list,
        })
      );

      const activeWorkspaceID = activeWorkspaceIDSelector(getState());
      if (activeWorkspaceID) dispatch(updateLists(activeWorkspaceID));
    }
  } catch (err) {
    console.error(err);
    dispatch(setError('Error renaming list'));
  }
};

export const deleteList = (listId) => async (dispatch, getState) => {
  const state = getState();
  const activeWorkspaceID = activeWorkspaceIDSelector(state);
  const lists = state.list;
  const list = lists.byId[listId];

  // eslint-disable-next-line promise/catch-or-return
  await Promise.all(list.projects.map((projectID) => dispatch(deleteProject(projectID))));

  await dispatch(Lists.delete({ id: listId }));
  if (activeWorkspaceID) await dispatch(updateLists(activeWorkspaceID));
};

export const clearNewList = (listId) => (dispatch, getState) => {
  const lists = getState().list;

  let list = lists.byId[listId];
  if (list) {
    list = update(list, {
      $unset: ['isNew'],
    });
    dispatch(
      Lists.update(
        {
          id: listId,
          data: list,
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
    const { projects: dProjectIds } = state.list.byId[dListId];
    const { projects: hProjectIds } = state.list.byId[hListId];

    const dIndex = dProjectIds.indexOf(dId);
    const hIndex = hProjectIds.indexOf(hId);

    if (dIndex === -1) return;

    const newDProjectIds = [...dProjectIds];

    if (hListId === dListId) {
      newDProjectIds.splice(dIndex, 1);
      newDProjectIds.splice(hIndex, 0, dProjectIds[dIndex]);
      dispatch(
        Lists.update({
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
      Lists.update({
        id: dListId,
        data: {
          projects: newDProjectIds,
        },
      })
    );
    dispatch(
      Lists.update({
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
    const { allIds, byId } = state.list;

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

export const deleteBoardProject = (listId, projectID) => async (dispatch, getState) => {
  const state = getState();
  const teamID = activeWorkspaceIDSelector(state);

  const projectList = withoutValue(state.list.byId[listId].projects, projectID);
  const updatedList = { ...state.list.byId[listId], projects: projectList };

  await dispatch(deleteProject(projectID));
  await dispatch(updateList(listId, updatedList));
  await dispatch(updateLists(teamID));
};
