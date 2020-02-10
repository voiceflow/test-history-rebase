import { createSelector } from 'reselect';

import client from '@/client';
import { toast } from '@/components/Toast';
import { EDITOR_SEAT_ROLES } from '@/constants';
import { getAlternativeColor } from '@/utils/colors';

import Normalize, { deleteNormalize, normalize } from './_normalize';
import * as Modal from './modal';
import * as Tracking from './tracking';
import { createRootSelector } from './utils';

export const STATE_KEY = 'workspace';

const MEMBER_UPDATE_ERR = 'Unable to Update Members';
const WORKSPACE_FALLBACK_ERROR_MESSAGE = 'Error updating Workspace';
const initialState = {
  activeWorkspaceID: localStorage.getItem('team'),
  byId: {},
  allIds: [],
};

const extractErrorMessages = (err) => {
  const errors = err?.body?.errors || err?.body || {};

  const errorMessage = Object.keys(errors).reduce((str, key) => {
    const error = errors[key];

    return `${str}${error.message || error}\n`;
  }, '');

  return errorMessage || WORKSPACE_FALLBACK_ERROR_MESSAGE;
};

const extractErrorFromResponseData = (err, defaultMessage) =>
  err?.response?.data || err?.body?.data || (err && JSON.stringify(err)) || defaultMessage;

// reducers

export default function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CURRENT_WORKSPACE':
      localStorage.setItem('team', action.payload);
      return {
        ...state,
        activeWorkspaceID: action.payload,
      };
    case 'UPDATE_WORKSPACES':
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    default:
      return state;
  }
}

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const activeWorkspaceIDSelector = createSelector(
  rootSelector,
  ({ activeWorkspaceID }) => activeWorkspaceID
);

export const activeWorkspaceSelector = createSelector(
  rootSelector,
  activeWorkspaceIDSelector,
  ({ byId }, workspaceID) => byId[workspaceID]
);

export const workspaceNumberOfSeatsSelector = createSelector(
  activeWorkspaceSelector,
  ({ seats }) => seats
);

export const planTypeSelector = createSelector(
  activeWorkspaceSelector,
  ({ plan }) => plan
);

export const onPaidPlan = createSelector(
  planTypeSelector,
  (plan) => !!plan
);

export const workspaceByIDSelector = createSelector(
  rootSelector,
  ({ byId }) => (workspaceID) => byId[workspaceID]
);

export const activeWorkspaceMembersSelector = createSelector(
  activeWorkspaceSelector,
  (activeWorkspace) => activeWorkspace?.members || []
);

export const seatLimits = createSelector(
  activeWorkspaceSelector,
  ({ seatLimits }) => seatLimits
);

export const usedEditorSeats = createSelector(
  activeWorkspaceMembersSelector,
  (members) => members.filter((member) => EDITOR_SEAT_ROLES.includes(member.role)).length || 1
);

export const usedViewerSeats = createSelector(
  activeWorkspaceMembersSelector,
  (members) => members.filter((member) => !EDITOR_SEAT_ROLES.includes(member.role)).length
);

export const allWorkspacesSelector = createSelector(
  rootSelector,
  ({ allIds, byId }) => allIds.map((workspaceID) => byId[workspaceID])
);

export const workspaceMemberSelector = createSelector(
  activeWorkspaceMembersSelector,
  (members) => (creatorID) => members?.find((member) => String(member.creator_id) === creatorID) || null
);

export const distinctWorkspaceMemberSelector = createSelector(
  workspaceMemberSelector,
  (getWorkspaceMember) => (creatorID, tabID) => {
    const workspaceMember = getWorkspaceMember(creatorID);

    return workspaceMember ? { ...workspaceMember, color: getAlternativeColor(tabID) } : null;
  }
);

// actions

const updateWorkspaces = ({ byId, allIds }) => ({
  type: 'UPDATE_WORKSPACES',
  payload: { byId, allIds },
});

const Workspaces = new Normalize('id', 'workspace', updateWorkspaces);

export const updateWorkspace = (workspaceId, data) => (dispatch) => dispatch(Workspaces.update({ id: workspaceId, data }));

export const updateCurrentWorkspace = (workspaceId) => ({ type: 'UPDATE_CURRENT_WORKSPACE', payload: workspaceId });

export const updateCurrentWorkspaceItem = (payload) => (dispatch, getState) => {
  const workspaceId = activeWorkspaceIDSelector(getState());

  if (workspaceId) {
    dispatch(updateWorkspace(workspaceId, payload));
  }
};

export const removeWorkspace = (workspaceId) => async (dispatch, getState) => {
  const workspaces = getState().workspace;
  const state = deleteNormalize(workspaceId, workspaces);
  // default to the first existing team
  const newWorkspace = state.allIds.length > 0 ? state.allIds[0] : undefined;

  dispatch(updateCurrentWorkspace(newWorkspace));
  dispatch(updateWorkspaces(state));
};

export const deleteWorkspace = (workspaceId) => async (dispatch) => {
  try {
    await client.workspace.deleteWorkspace(workspaceId);

    dispatch(removeWorkspace(workspaceId));
    toast.success('Successfully deleted workspace');
  } catch (err) {
    dispatch(Modal.setError(err.body.data || 'Unable to delete workspace'));

    return Promise.reject();
  }
};

export const fetchWorkspaces = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = activeWorkspaceIDSelector(state);

    const workspaces = await client.workspace.find();

    // NORMALIZE TEAMS
    const normalizedWorkspaces = normalize('id', workspaces.map((workspace) => ({ ...workspace })));

    // If the current team doesn't exist, default it to something else
    dispatch(updateWorkspaces(normalizedWorkspaces));

    if (!normalizedWorkspaces.byId.hasOwnProperty(activeWorkspaceID)) {
      dispatch(updateCurrentWorkspace(workspaces[0]?.id));
    }
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspaces'));

    return Promise.reject();
  }
};

export const leaveWorkspace = () => async (dispatch, getState) => {
  try {
    const store = getState();
    const targetWorkspaceId = activeWorkspaceIDSelector(store);
    await client.workspace.leaveWorkspace(targetWorkspaceId);

    dispatch(removeWorkspace(targetWorkspaceId));
    toast.success('Successfully left workspace');
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERR)));

    return Promise.reject();
  }
};

export const fetchWorkspace = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const activeWorkspaceID = activeWorkspaceIDSelector(state);

    const [workspace] = await client.workspace.fetchWorkspace(activeWorkspaceID);

    dispatch(updateWorkspace(activeWorkspaceID, workspace));
  } catch (err) {
    dispatch(Modal.setError('Unable to fetch workspace'));

    return Promise.reject();
  }
};

export const createWorkspace = (data) => async (dispatch) => {
  try {
    return client.workspace.createWorkspace(data);
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERR)));

    return Promise.reject();
  }
};

export const updateMembers = (members, options) => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState());
    const body = {
      ...options,
      // switch invite field to email field
      members: members.map((m) => ({ ...m, email: m.invite || m.email })),
    };

    const workspace = await client.workspace.updateMembers(activeWorkspaceID, body);

    dispatch(updateCurrentWorkspaceItem(workspace));
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, MEMBER_UPDATE_ERR)));

    return Promise.reject();
  }
};

export const updateWorkspaceName = (name) => async (dispatch, getState) => {
  try {
    const activeWorkspaceID = activeWorkspaceIDSelector(getState());

    await client.workspace.updateName(activeWorkspaceID, name);

    dispatch(updateWorkspace(activeWorkspaceID, { name }));
  } catch (err) {
    dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invalid Workspace Name')));

    return Promise.reject();
  }
};

export const validateInvite = (invite) => {
  return async (dispatch) => {
    try {
      const workspaceId = await client.workspace.validateInvite(invite);

      dispatch(updateCurrentWorkspace(workspaceId));

      return workspaceId;
    } catch (err) {
      dispatch(Modal.setError(extractErrorFromResponseData(err, 'Invite Invalid')));
    }
  };
};

// /////////////////////////
// New workspace actions  //
// /////////////////////////

export const sendInvite = (email, permissionType) => {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const currentWorkspaceId = activeWorkspaceIDSelector(state);
      const currentMembers = activeWorkspaceMembersSelector(state);

      const newMember = await client.workspace.sendInvite(currentWorkspaceId, email, permissionType || undefined);

      if (newMember) {
        dispatch(updateWorkspace(currentWorkspaceId, { members: [...currentMembers, newMember] }));
        dispatch(Tracking.trackInvitationSent(currentWorkspaceId, email));
      }

      toast.success('Sent invite');
      return true;
    } catch (err) {
      toast.error(extractErrorMessages(err));

      return Promise.reject();
    }
  };
};

export const updateInvite = (email, permissionType) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const currentWorkspaceId = activeWorkspaceIDSelector(state);
      const currentMembers = activeWorkspaceMembersSelector(state);

      await client.workspace.updateInvite(currentWorkspaceId, email, permissionType);

      const updatedMembers = currentMembers.map((member) => (member.email !== email ? member : { ...member, role: permissionType }));

      dispatch(updateWorkspace(currentWorkspaceId, { members: updatedMembers }));
      toast.success('Updated permissions');
    } catch (err) {
      toast.error(extractErrorMessages(err));

      return Promise.reject();
    }
  };
};

export const cancelInvite = (email) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceId = activeWorkspaceIDSelector(state);
      const currentMembers = activeWorkspaceMembersSelector(state);

      await client.workspace.cancelInvite(workspaceId, email);
      dispatch(Tracking.trackInvitationCancelled(workspaceId, email));

      const updatedMembers = currentMembers.filter((member) => member.email !== email);

      dispatch(updateWorkspace(workspaceId, { members: updatedMembers }));
      toast.success('Cancelled invite');
    } catch (err) {
      toast.error(extractErrorMessages(err));

      return Promise.reject();
    }
  };
};

export const updateMember = (creatorId, role) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceId = activeWorkspaceIDSelector(state);
      const currentMembers = activeWorkspaceMembersSelector(state);

      await client.workspace.updateMember(workspaceId, creatorId, role);

      const updatedMembers = currentMembers.map((member) => (member.creator_id === creatorId ? { ...member, role } : member));

      dispatch(updateWorkspace(workspaceId, { members: updatedMembers }));
    } catch (err) {
      toast.error(extractErrorMessages(err));

      return Promise.reject();
    }
  };
};

export const deleteMember = (creatorId) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const workspaceID = activeWorkspaceIDSelector(state);
      const currentMembers = activeWorkspaceMembersSelector(state);

      await client.workspace.deleteMember(workspaceID, creatorId);

      const updatedMembers = currentMembers.filter((member) => member.creator_id !== creatorId);

      dispatch(updateWorkspace(workspaceID, { members: updatedMembers }));
    } catch (err) {
      toast.error(extractErrorMessages(err));

      return Promise.reject();
    }
  };
};

export const getMembers = (workspaceId) => {
  return async (dispatch) => {
    try {
      const members = await client.workspace.findMembers(workspaceId);

      dispatch(Workspaces.update({ id: workspaceId, data: { members } }));
    } catch (err) {
      toast.error('Unable to retrieve members');

      return Promise.reject();
    }
  };
};
