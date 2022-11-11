import { AnyRecord } from '@voiceflow/base-types';

import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';

import { ProjectEventInfo, VersionEventInfo, WorkspaceEventInfo } from './types';

type EventTracker<T> = (...args: T extends AnyRecord ? [T] : []) => SyncThunk;

interface EventPayload<P extends AnyRecord> {
  hashed?: (keyof P)[];
  teamhashed?: (keyof P)[];
  properties?: P;
}

interface EventPayloadOptions<K> {
  hashed?: K[];
  teamhashed?: K[];
}

type WorkspaceEventPayload<P extends AnyRecord> = EventPayload<P & { workspace_id: WorkspaceEventInfo['workspaceID'] }>;

type ProjectEventPayload<P extends AnyRecord> = WorkspaceEventPayload<P & { project_id: ProjectEventInfo['projectID'] }>;

type VersionEventPayload<P extends AnyRecord> = ProjectEventPayload<P & { skill_id: VersionEventInfo['skillID'] }>;

export const createWorkspaceEventTracker =
  <T>(callback: (options: T extends AnyRecord ? WorkspaceEventInfo & T : WorkspaceEventInfo, ...args: Parameters<Thunk>) => void): EventTracker<T> =>
  (...args): SyncThunk =>
  (dispatch, getState, extra) => {
    const state = getState();
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    if (!workspaceID) return;

    const eventInfo = {
      ...args[0],
      workspaceID,
    } as T extends AnyRecord ? WorkspaceEventInfo & T : WorkspaceEventInfo;

    callback(eventInfo, dispatch, getState, extra);
  };

export const createWorkspaceEventPayload = <T extends WorkspaceEventInfo, D extends {}, K extends keyof D>(
  { workspaceID }: T,
  data: D = {} as D,
  { hashed = [], teamhashed = [] }: EventPayloadOptions<K> = {}
): WorkspaceEventPayload<D> => {
  return {
    hashed,
    teamhashed: ['workspace_id', ...teamhashed],
    properties: {
      ...data,
      workspace_id: workspaceID,
      last_product_activity: new Date().toISOString().slice(0, 10), // Format timestamp to YYYY-MM-DD for HubSpot
    },
  };
};

export const createProjectEventTracker = <T>(
  callback: (options: T extends AnyRecord ? ProjectEventInfo & T : ProjectEventInfo, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createWorkspaceEventTracker<T>((data, dispatch, getState, extra) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    if (!projectID) return;

    const eventInfo = {
      ...data,
      projectID,
    } as T extends AnyRecord ? ProjectEventInfo & T : ProjectEventInfo;

    callback(eventInfo, dispatch, getState, extra);
  });

export const createProjectEventPayload = <T extends ProjectEventInfo, D extends {}, K extends keyof D>(
  { projectID, ...workspaceData }: T,
  data: D = {} as D,
  options?: EventPayloadOptions<K>
): ProjectEventPayload<D> => createWorkspaceEventPayload(workspaceData, { ...data, project_id: projectID }, options);

export const createVersionEventTracker = <T>(
  callback: (options: T extends AnyRecord ? VersionEventInfo & T : VersionEventInfo, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createProjectEventTracker<T>((data, dispatch, getState, extra) => {
    const state = getState();
    const skillID = Session.activeVersionIDSelector(state);

    if (!skillID) return;

    const eventInfo = {
      ...data,
      skillID,
    } as T extends AnyRecord ? VersionEventInfo & T : VersionEventInfo;

    callback(eventInfo, dispatch, getState, extra);
  });

export const createVersionEventPayload = <T extends VersionEventInfo, D extends {}, K extends keyof D>(
  { skillID, ...projectData }: T,
  data: D = {} as D,
  options?: EventPayloadOptions<K>
): VersionEventPayload<D> => createProjectEventPayload(projectData, { ...data, skill_id: skillID }, options);
