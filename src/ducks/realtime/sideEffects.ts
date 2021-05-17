import { ActionCreators } from 'redux-undo';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Creator from '@/ducks/creator/diagram/actions';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import mutableStore from '@/store/mutable';
import { SyncThunk, Thunk } from '@/store/types';

import {
  AnyRealtimeAction,
  connectRealtime,
  disconnectRealtime,
  initializeRealtime,
  resetRealtime,
  resetSessionBusy,
  setRealtimeRestriction,
  setSessionBusy,
  updateActiveDiagramViewers,
} from './actions';
import { isRealtimeConnectedSelector } from './selectors';
import * as Socket from './socket';
import { RealtimeLocks } from './types';
import { createServerAction, removeSelfFromLocks } from './utils';

export const updateDiagramViewers = (users: RealtimeLocks['users']): Thunk => async (dispatch, getState) => {
  const state = getState();
  const diagramID = Session.activeDiagramIDSelector(state);
  const hasWorkspaceMemberSelector = Workspace.hasWorkspaceMemberSelector(state);

  Errors.assertDiagramID(diagramID);

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

export const sendRealtimeUpdate = (action: Socket.AnySocketAction | AnyRealtimeAction): Thunk => async (_, getState) => {
  const state = getState();
  const lastTimestamp = mutableStore.getLastRealtimeTimestamp()!;
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const serverAction = createServerAction(action)!;
    const lockAction = action?.meta?.lock || null;

    await client.socket.diagram.sendUpdate(action, lastTimestamp, lockAction, serverAction);
  }
};

export const sendRealtimeVolatileUpdate = (action: Socket.AnySocketAction): SyncThunk => (_, getState) => {
  const isConnected = isRealtimeConnectedSelector(getState());

  if (isConnected) {
    client.socket.diagram.sendVolatileUpdate(action);
  }
};

export const sendRealtimeProjectUpdate = (action: Socket.AnySocketAction): Thunk => async (_, getState) => {
  const state = getState();
  const lastTimestamp = mutableStore.getLastRealtimeTimestamp()!;
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const lockAction = action?.meta?.lock || null;

    await client.socket.project.sendUpdate(action, lastTimestamp, lockAction);
  }
};

export const terminateRealtimeConnection = (): Thunk => async (dispatch) => {
  dispatch(disconnectRealtime());

  if (client.socket.isConnected()) {
    await client.socket.diagram.terminate();
  }

  mutableStore.setLastRealtimeTimestamp(null);
  dispatch(resetRealtime());
};

export const handleRealtimeTakeover = (): SyncThunk => (dispatch) => {
  client.socket.project.takeoverSession();
  dispatch(resetSessionBusy());
};

export const setupRealtimeConnection = (skillID: string, diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const tabID = Session.tabIDSelector(state);

  try {
    const locks = await client.socket!.diagram.initialize(skillID, diagramID);

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
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  await dispatch(setupRealtimeConnection(versionID, diagramID));
};

export const reestablishConnection = (): Thunk => async (dispatch) => {
  await dispatch(setupActiveDiagramConnection());
  dispatch(connectRealtime());
  await dispatch(sendRealtimeUpdate(Socket.reconnectNoop()));
};
