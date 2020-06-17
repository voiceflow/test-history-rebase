import { ActionCreators } from 'redux-undo';

import client from '@/client';
import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import { goToDashboard } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { SyncThunk, Thunk } from '@/store/types';

import {
  AnyRealtimeAction,
  disconnectRealtime,
  initializeRealtime,
  resetRealtime,
  resetSessionBusy,
  setRealtimeRestriction,
  setSessionBusy,
  updateActiveDiagramViewers,
} from './actions';
import { isRealtimeConnectedSelector, lastRealtimeTimestampSelector } from './selectors';
import * as Socket from './socket';
import { RealtimeLocks } from './types';
import { createServerAction, removeSelfFromLocks } from './utils';

export const updateDiagramViewers = (users: RealtimeLocks['users']): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagramID = Skill.activeDiagramIDSelector(state);
  const hasWorkspaceMemberSelector = Workspace.hasWorkspaceMemberSelector(state);
  const diagramViewers = Object.values(users[diagramID] ?? {});
  const newMembers = diagramViewers.filter((viewer) => !hasWorkspaceMemberSelector(viewer));

  if (newMembers.length) {
    const workspaceID = Workspace.activeWorkspaceIDSelector(state)!;

    await dispatch(Workspace.getMembers(workspaceID));
  }

  // reinitialize history if no other collaborators present
  if (diagramViewers.length === 1) {
    dispatch(Creator.saveHistory({ force: true, preventUpdate: true }));
    dispatch(ActionCreators.clearHistory());
  }

  dispatch(updateActiveDiagramViewers(users));
};

export const sendHeartbeat = (): SyncThunk => () => client.socket?.realtime.sendHeartbeat();

export const sendRealtimeUpdate = (action: Socket.AnySocketAction | AnyRealtimeAction): Thunk => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state)!;
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const serverAction = createServerAction(action)!;
    const lockAction = action?.meta?.lock || null;

    await client.socket?.realtime.sendUpdate(action, lastTimestamp, lockAction, serverAction);
  }
};

export const sendRealtimeVolatileUpdate = (action: Socket.AnySocketAction): SyncThunk => (_, getState) => {
  const isConnected = isRealtimeConnectedSelector(getState());

  if (isConnected) {
    client.socket?.realtime.sendVolatileUpdate(action);
  }
};

export const sendRealtimeProjectUpdate = (action: Socket.AnySocketAction): Thunk => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state)!;
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const lockAction = action?.meta?.lock || null;

    await client.socket?.realtime.sendProjectUpdate(action, lastTimestamp, lockAction);
  }
};

export const terminateRealtimeConnection = (): Thunk => async (dispatch) => {
  dispatch(disconnectRealtime());
  await client.socket?.realtime.terminate();
  dispatch(resetRealtime());
};

export const handleRealtimeTakeover = (): SyncThunk => (dispatch) => {
  client.socket?.realtime.initiateSessionTakeOver();
  dispatch(resetSessionBusy());
};

export const handleSessionCancelled = (data: { workspaceName: string; workspaceId: string }): Thunk => async (dispatch, getState) => {
  const currentWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await dispatch(Workspace.removeWorkspace(data.workspaceId));

  if (currentWorkspaceID === data.workspaceId) {
    dispatch(goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${data.workspaceName}" workspace`);
};

export const setupRealtimeConnection = (skillID: string, diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const tabID = Session.tabIDSelector(state);

  try {
    const locks = await client.socket!.realtime.initialize(skillID, diagramID);

    dispatch(initializeRealtime(diagramID, removeSelfFromLocks(locks, tabID)));
    await dispatch(sendRealtimeUpdate(Socket.reconnectNoop()));
  } catch (e) {
    // for Starter and Pro plans users will not have Realtime feature | error: {busyBy: ['creatorId1']}
    if (e.busyBy) {
      dispatch(setRealtimeRestriction());
    }

    // for Team or Enterprise plans | error: { browserId: "xxxx", device: {os: "xx", version: "XX.XX.XX", browser: "xx"}
    else {
      dispatch(setSessionBusy());
    }
  }
};

export const setupActiveDiagramConnection = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  await dispatch(setupRealtimeConnection(skillID, diagramID));
};
