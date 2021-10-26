import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as Session from '@/ducks/session';
import { getActiveWorkspaceContext } from '@/ducks/workspace/utils';
import { ProjectList } from '@/models';
import { Thunk } from '@/store/types';
import { replace, unique } from '@/utils/array';
import { cuid } from '@/utils/string';
import * as Sentry from '@/vendors/sentry';

import { crud, removeProjectFromList, transplantProject } from '../actions';
import { addProjectToList } from './shared';

export * from './shared';

/**
 * @deprecated these are now loaded automatically by the subscription to the workspace/:workspaceID realtime event channel
 */
export const loadProjectLists =
  (workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    try {
      const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
      if (isAtomicActions) return;

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

      dispatch(crud.replace(normalizedLists));
    } catch (err) {
      Sentry.error(err);
      dispatch(Modal.setError('Unable to retrieve lists'));
    }
  };

/**
 * @deprecated list management behaviour has been moved to the realtime service
 */
export const saveProjectListsForWorkspace =
  (workspaceID: string): Thunk =>
  async (_, getState) => {
    const state = getState();
    const projectLists = ProjectListV2.allProjectListsSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    if (projectLists.length) {
      await client.projectList.update(workspaceID, projectLists);
    }
  };

export const createProjectList =
  (workspaceID?: string, name?: string): Thunk<ProjectList> =>
  async (dispatch, getState) => {
    const state = getState();

    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    const id = cuid();
    const list: ProjectList = {
      id,
      name: name ?? 'New List',
      projects: [],
    };

    if (isAtomicActions) {
      const targetWorkspaceID = workspaceID || activeWorkspaceID;

      Errors.assertWorkspaceID(targetWorkspaceID);

      await dispatch.sync(Realtime.projectList.crud.add({ workspaceID: targetWorkspaceID, key: id, value: list }));
    } else {
      dispatch(crud.add(id, list));
    }

    return list;
  };

export const renameProjectList =
  (listID: string, name: string): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          dispatch(crud.patch(listID, { name }));
        },
        async (context) => {
          await dispatch.sync(Realtime.projectList.crud.patch({ ...context, key: listID, value: { name } }));
        }
      )
    );

/**
 * @deprecated list management behaviour has been moved to the realtime service
 */
export const saveProjectToList =
  (workspaceID: string, lists: ProjectList[], projectID: string): Thunk =>
  async (_dispatch, getState) => {
    try {
      const state = getState();
      const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
      if (isAtomicActions) return;

      const newList = { ...lists[0], projects: [projectID, ...lists[0].projects] };

      await client.projectList.update(workspaceID, replace(lists, 0, newList));
    } catch (err) {
      Sentry.error(err);
      throw err;
    }
  };

/**
 * @deprecated list management behaviour has been moved to the realtime service
 */
export const addProjectToDefaultList =
  (projectID: string, workspaceID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    let defaultList = ProjectListV2.defaultProjectListSelector(state);

    if (!defaultList) {
      defaultList = await dispatch(createProjectList(workspaceID, Realtime.DEFAULT_PROJECT_LIST_NAME));
    }

    dispatch(addProjectToList(defaultList.id, projectID));
  };

export const deleteProjectList =
  (listID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const list = ProjectListV2.projectListByIDSelector(state, { id: listID });

    Errors.assertProjectList(listID, list);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await dispatch(Project.deleteManyProjects(list.projects));

          dispatch(crud.remove(listID));
        },
        async (context) => {
          await dispatch.sync(Realtime.projectList.crud.remove({ ...context, key: listID }));
        }
      )
    );
  };

export const deleteProjectFromList =
  (listID: string, projectID: string): Thunk =>
  async (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          await dispatch(Project.deleteProject(projectID));

          dispatch(removeProjectFromList(listID, projectID));
        },
        async (context) => {
          await dispatch.sync(Realtime.projectList.removeProjectFromList({ ...context, listID, projectID }));
        }
      )
    );

export const moveProjectList =
  (fromID: string, toID: string): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          dispatch(crud.move(fromID, toID));
        },
        async (context) => {
          await dispatch.sync(Realtime.projectList.crud.move({ ...context, from: fromID, to: toID }));
        }
      )
    );

export const transplantProjectBetweenLists =
  (projectID: string, fromListID: string, toListID: string, target: string | number): Thunk =>
  async (dispatch, getState) => {
    const fromList = ProjectListV2.projectListByIDSelector(getState(), { id: fromListID });

    if (fromListID === toListID && target === fromList?.projects.indexOf(projectID)) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveWorkspaceContext,
        async () => {
          dispatch(transplantProject({ listID: fromListID, projectID }, { listID: toListID, target }));
        },
        async (context) => {
          await dispatch.sync(
            Realtime.projectList.transplantProjectBetweenLists({
              ...context,
              from: { listID: fromListID, projectID },
              to: { listID: toListID, target },
            })
          );
        }
      )
    );
  };
