import { ActionCreators } from 'redux-undo';

import client from '@/client';
import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import { goToDashboard } from '@/ducks/router/actions';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';

import { disconnectRealtime, initializeRealtime, resetRealtime, resetSessionBusy, setSessionBusy, updateActiveDiagramViewers } from './actions';
import { isRealtimeConnectedSelector, lastRealtimeTimestampSelector } from './selectors';
import * as Socket from './socket';
import { createServerAction, removeSelfFromLocks } from './utils';

export const updateDiagramViewers = (users) => async (dispatch, getState) => {
  const state = getState();
  const diagramID = Skill.activeDiagramIDSelector(state);
  const workspaceMemberSelector = Workspace.workspaceMemberSelector(state);
  const diagramViewers = Object.values(users[diagramID]);
  const newMembers = diagramViewers.filter((viewer) => !workspaceMemberSelector(viewer));

  if (newMembers.length) {
    const workspaceID = Workspace.activeWorkspaceIDSelector(state);

    dispatch(Workspace.getMembers(workspaceID));
  }

  // reinitialize history if no other collaborators present
  if (diagramViewers.length === 1) {
    dispatch(Creator.saveHistory({ force: true, preventUpdate: true }));
    dispatch(ActionCreators.clearHistory());
  }

  dispatch(updateActiveDiagramViewers(users));
};

export const sendHeartbeat = () => () => client.socket.realtime.sendHeartbeat();

export const sendRealtimeUpdate = (action) => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const serverAction = createServerAction(action);
    const lockAction = action?.meta?.lock;

    await client.socket.realtime.sendUpdate(action, lastTimestamp, lockAction, serverAction);
  }
};

export const sendRealtimeVolatileUpdate = (action) => (_, getState) => {
  const isConnected = isRealtimeConnectedSelector(getState());

  if (isConnected) {
    client.socket.realtime.sendVolatileUpdate(action);
  }
};

export const sendRealtimeProjectUpdate = (action) => async (_, getState) => {
  const state = getState();
  const lastTimestamp = lastRealtimeTimestampSelector(state);
  const isConnected = isRealtimeConnectedSelector(state);

  if (isConnected) {
    const lockAction = action?.meta?.lock;

    await client.socket.realtime.sendProjectUpdate(action, lastTimestamp, lockAction);
  }
};

export const terminateRealtimeConnection = () => async (dispatch) => {
  dispatch(disconnectRealtime());
  await client.socket.realtime.terminate();
  dispatch(resetRealtime());
};

export const handleRealtimeTakeover = () => async (dispatch) => {
  await client.socket.realtime.initiateSessionTakeOver();
  dispatch(resetSessionBusy());
};

export const handleSessionCancelled = (data) => async (dispatch, getState) => {
  const currentWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await dispatch(Workspace.removeWorkspace(data.workspaceId));

  if (currentWorkspaceID === data.workspaceId) {
    dispatch(goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${data.workspaceName}" workspace`);
};

export const setupRealtimeConnection = (skillID, diagramID) => async (dispatch, getState) => {
  const tabID = Session.tabIDSelector(getState());

  try {
    const locks = await client.socket.realtime.initialize(skillID, diagramID);

    dispatch(initializeRealtime(diagramID, removeSelfFromLocks(locks, tabID)));
    await dispatch(sendRealtimeUpdate(Socket.reconnectNoop()));
  } catch (e) {
    // if socket throws an error then session is busy on another browser
    dispatch(setSessionBusy());
  }
};

export const setupActiveDiagramConnection = () => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  await dispatch(setupRealtimeConnection(skillID, diagramID));
};
