import { projectSelector } from '@/ducks/projectV2/selectors/active';
import * as Session from '@/ducks/session';
import { workspaceSelector } from '@/ducks/workspaceV2/selectors/active';
import type { SyncThunk, Thunk } from '@/store/types';

import type {
  BaseEventInfo,
  BaseOnlyKeys,
  DiagramEvent,
  DiagramEventInfo,
  DiagramOnlyKeys,
  EventOptions,
  EventTracker,
  OrganizationEventInfo,
  OrganizationOnlyKeys,
  ProjectEvent,
  ProjectEventInfo,
  ProjectOnlyKeys,
  VersionEvent,
  VersionEventInfo,
  VersionOnlyKeys,
  WorkspaceEvent,
  WorkspaceEventInfo,
  WorkspaceOnlyKeys,
} from './types';

export const getCurrentDate = (): string => new Date().toISOString().slice(0, 10); // Format timestamp to YYYY-MM-DD for HubSpot

export const createBaseEventTracker =
  <T>(callback: (options: T & BaseEventInfo, ...args: Parameters<Thunk>) => void): EventTracker<T> =>
  (properties = {}): SyncThunk =>
  (dispatch, getState, extra) => {
    callback(properties as T & BaseEventInfo, dispatch, getState, extra);
  };

export const createBaseEventTrackerFactory =
  <D>() =>
  <T>(callback: (options: T & BaseEventInfo & D, ...args: Parameters<Thunk>) => void): EventTracker<T & D> =>
    createBaseEventTracker<T & D>((data, dispatch, getState, extra) => callback(data, dispatch, getState, extra));

export const createBaseEvent = <T extends BaseEventInfo, K extends BaseOnlyKeys<keyof T>>(
  name: string,
  { creatorID, ...properties }: T,
  { envIDs = [], hashedIDs = [], workspaceHashedIDs = [] }: EventOptions<K> = {}
): WorkspaceEvent<T> => ({
  ...(creatorID && { identity: { userID: creatorID } }),
  name,
  envIDs,
  hashedIDs,
  workspaceHashedIDs,
  properties: { ...properties, last_product_activity: getCurrentDate() },
});

export const createOrganizationEvent = <T extends OrganizationEventInfo, K extends OrganizationOnlyKeys<keyof T>>(
  name: string,
  { organizationID, ...properties }: T,
  { envIDs = [], workspaceHashedIDs = [], ...options }: EventOptions<K> = {}
): WorkspaceEvent<T> =>
  createBaseEvent(
    name,
    { ...properties, ...(organizationID && { organization_id: organizationID }) },
    {
      ...options,
      envIDs: organizationID ? [...envIDs, 'organization_id'] : envIDs,
      workspaceHashedIDs: organizationID ? [...workspaceHashedIDs, 'organization_id'] : workspaceHashedIDs,
    }
  );

export const createWorkspaceEventTracker = <T>(
  callback: (options: T & WorkspaceEventInfo, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createBaseEventTracker<T>((data, dispatch, getState, extra) => {
    const workspace = workspaceSelector(getState());

    if (!workspace) return;

    callback(
      { ...data, workspaceID: workspace.id, organizationID: workspace.organizationID },
      dispatch,
      getState,
      extra
    );
  });

export const createWorkspaceEvent = <T extends WorkspaceEventInfo, K extends WorkspaceOnlyKeys<keyof T>>(
  name: string,
  { workspaceID, ...properties }: T,
  { envIDs = [], workspaceHashedIDs = [], ...options }: EventOptions<K> = {}
): WorkspaceEvent<T> =>
  createOrganizationEvent(
    name,
    { ...properties, workspace_id: workspaceID },
    {
      ...options,
      envIDs: [...envIDs, 'workspace_id' as const],
      workspaceHashedIDs: [...workspaceHashedIDs, 'workspace_id'],
    }
  );

export const createProjectEventTracker = <T>(
  callback: (options: ProjectEventInfo & T, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createWorkspaceEventTracker<T>((data, dispatch, getState, extra) => {
    const project = projectSelector(getState());

    if (!project) return;

    const payload = {
      ...data,
      projectID: project.id,
      nluType: project.nlu,
      platform: project.platform,
      projectType: project.type,
    };

    callback(payload, dispatch, getState, extra);
  });

export const createProjectEvent = <T extends ProjectEventInfo, K extends ProjectOnlyKeys<keyof T>>(
  name: string,
  { nluType, platform, projectType, projectID, ...properties }: T,
  options?: EventOptions<K>
): ProjectEvent<T> =>
  createWorkspaceEvent(
    name,
    {
      ...properties,
      project_id: projectID,
      project_nlu: nluType,
      project_type: projectType,
      project_platform: platform,
    },
    options
  );

export const createVersionEventTracker = <T>(
  callback: (options: VersionEventInfo & T, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createProjectEventTracker<T>((data, dispatch, getState, extra) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    if (!versionID) return;

    callback({ ...data, versionID }, dispatch, getState, extra);
  });

export const createVersionEvent = <T extends VersionEventInfo, K extends VersionOnlyKeys<keyof T>>(
  name: string,
  { versionID, ...properties }: T,
  options?: EventOptions<K>
): VersionEvent<T> => createProjectEvent(name, { ...properties, version_id: versionID }, options);

export const createDiagramEventTracker = <T>(
  callback: (options: DiagramEventInfo & T, ...args: Parameters<Thunk>) => void
): EventTracker<T> =>
  createVersionEventTracker<T>((data, dispatch, getState, extra) => {
    const state = getState();
    const diagramID = Session.activeDiagramIDSelector(state);

    if (!diagramID) return;

    callback({ ...data, diagramID }, dispatch, getState, extra);
  });

export const createDiagramEvent = <T extends DiagramEventInfo, K extends DiagramOnlyKeys<keyof T>>(
  name: string,
  { diagramID, ...properties }: T,
  options?: EventOptions<K>
): DiagramEvent<T> => createVersionEvent(name, { ...properties, diagram_id: diagramID }, options);
