import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as Session from '@/ducks/session';
import { ProjectList } from '@/models';
import { Thunk } from '@/store/types';
import { replace, unique, withoutValue } from '@/utils/array';
import { cuid } from '@/utils/string';
import * as Sentry from '@/vendors/sentry';

import { addProjectList, removeProjectFromList, removeProjectList, replaceProjectLists, updateProjectList } from '../actions';
import { addProjectToList, listNotFoundError, saveRealtimeProjectListsForWorkspace } from './shared';

export { addProjectToList, saveRealtimeProjectListsForWorkspace } from './shared';

export const loadProjectLists =
  (workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

      // TODO: remove when project duck will be moved to realtime
      if (atomicActionsEnabled) {
        await dispatch(Project.loadProjectsByWorkspaceID(workspaceID));

        return;
      }

      const lists = await client.projectList.find(workspaceID);

      const rawProjects = await dispatch(Project.loadProjectsByWorkspaceID(workspaceID));

      const projectIDs = rawProjects.map(({ id }) => id);

      // determine if there are any projects not on a board
      const usedProjects = new Set();
      let normalizedLists = lists.map((list) => {
        const projects = unique(list.projects).filter((projectID) => projectIDs.includes(projectID) && !usedProjects.has(projectID));

        projects.forEach((projectID) => usedProjects.add(projectID));

        return {
          ...list,
          projects,
        };
      });

      const unusedProjects = new Set(projectIDs.filter((projectID) => !usedProjects.has(projectID)));

      // dump all projects not used in any of the other lists
      if (unusedProjects.size > 0) {
        const unusedProjectIDs = Array.from(unusedProjects);
        const defaultList = normalizedLists.find((list) => list.name === Realtime.DEFAULT_PROJECT_LIST_NAME);

        if (defaultList) {
          const projects = unique([...defaultList.projects, ...unusedProjectIDs]);
          normalizedLists = replace(normalizedLists, normalizedLists.indexOf(defaultList), { ...defaultList, projects });
        } else {
          normalizedLists.push({
            id: cuid(),
            name: Realtime.DEFAULT_PROJECT_LIST_NAME,
            projects: unusedProjectIDs,
          });
        }
      }

      dispatch(replaceProjectLists(normalizedLists));
    } catch (err) {
      Sentry.error(err);
      dispatch(Modal.setError('Unable to retrieve lists'));
    }
  };

export const saveProjectListsForWorkspace =
  (workspaceID: string): Thunk =>
  async (_, getState) => {
    const projectLists = ProjectListV2.allProjectListsSelector(getState());

    if (projectLists.length) {
      await client.projectList.update(workspaceID, projectLists);
    }
  };

export const saveRealtimeProjectListsForActiveWorkspace = (): Thunk => async (dispatch, getState) => {
  const atomicActionsEnabled = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

  if (!atomicActionsEnabled) {
    return;
  }

  const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

  Errors.assertWorkspaceID(activeWorkspaceID);

  await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
};

export const createProjectList =
  (workspaceID?: string, name?: string): Thunk<ProjectList> =>
  async (dispatch, getState) => {
    const state = getState();

    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    const id = cuid();
    const list = {
      id,
      name: name ?? 'New List',
      isNew: true,
      projects: [],
    };

    if (atomicActionsEnabled) {
      const _workspaceID = workspaceID || activeWorkspaceID;

      Errors.assertWorkspaceID(_workspaceID);

      await dispatch.sync(Realtime.projectList.crud.add({ workspaceID: _workspaceID, key: id, value: list }));

      await dispatch(saveRealtimeProjectListsForWorkspace(_workspaceID));
    } else {
      dispatch(addProjectList(id, list));
    }

    return list;
  };

export const renameProjectList =
  (listID: string, name: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      Errors.assertWorkspaceID(activeWorkspaceID);

      await dispatch.sync(
        Realtime.projectList.crud.patch({
          key: listID,
          value: { name },
          workspaceID: activeWorkspaceID,
        })
      );

      await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
    } else {
      dispatch(updateProjectList(listID, { name }, true));
    }
  };

export const clearNewProjectList =
  (listID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (atomicActionsEnabled) {
      Errors.assertWorkspaceID(activeWorkspaceID);

      await dispatch.sync(
        Realtime.projectList.crud.patch({
          key: listID,
          value: { isNew: false },
          workspaceID: activeWorkspaceID,
        })
      );

      await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
    } else {
      dispatch(updateProjectList(listID, { isNew: false }, true));
    }
  };

export const saveProjectToList =
  (workspaceID: string, lists: ProjectList[], projectID: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

      const newList = { ...lists[0], projects: [projectID, ...lists[0].projects] };

      await client.projectList.update(workspaceID, replace(lists, 0, newList));

      if (atomicActionsEnabled) {
        await dispatch.sync(Realtime.projectList.crud.patch({ workspaceID, key: newList.id, value: { projects: newList.projects } }));
      }
    } catch (err) {
      Sentry.error(err);
      throw err;
    }
  };

export const addProjectToDefaultList =
  (projectID: string, workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    let defaultList = ProjectListV2.defaultProjectListSelector(state);

    if (!defaultList) {
      defaultList = await dispatch(createProjectList(workspaceID, Realtime.DEFAULT_PROJECT_LIST_NAME));
    }

    if (atomicActionsEnabled) {
      await dispatch.sync(Realtime.projectList.crud.patch({ workspaceID, key: defaultList.id, value: { projects: defaultList.projects } }));

      await dispatch(saveRealtimeProjectListsForWorkspace(workspaceID));
    } else {
      dispatch(addProjectToList(defaultList.id, projectID));
    }
  };

export const deleteProjectList =
  (listID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const list = ProjectListV2.projectListByIDSelector(state, { id: listID });

    Errors.assert(list, listNotFoundError());

    await dispatch(Project.deleteManyProjects(list.projects));

    if (atomicActionsEnabled) {
      Errors.assertWorkspaceID(activeWorkspaceID);

      await dispatch.sync(Realtime.projectList.crud.remove({ workspaceID: activeWorkspaceID, key: listID }));

      await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
    } else {
      dispatch(removeProjectList(listID));
    }
  };

export const deleteProjectFromList =
  (listID: string, projectID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    await dispatch(Project.deleteProject(projectID));

    if (atomicActionsEnabled) {
      const list = ProjectListV2.projectListByIDSelector(state, { id: listID });

      Errors.assertWorkspaceID(activeWorkspaceID);
      Errors.assert(list, listNotFoundError());

      await dispatch.sync(
        Realtime.projectList.crud.patch({
          key: listID,
          value: { projects: withoutValue(list.projects, projectID) },
          workspaceID: activeWorkspaceID,
        })
      );

      await dispatch(saveRealtimeProjectListsForWorkspace(activeWorkspaceID));
    } else {
      dispatch(removeProjectFromList(listID, projectID));
    }
  };
