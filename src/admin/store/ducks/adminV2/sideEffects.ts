import moment from 'moment';

import { Admin } from '@/admin/client';
import { Creator, Workspace } from '@/admin/models';
import { getUserInfoType } from '@/admin/store/utils';
import { toast } from '@/components/Toast';
import { SyncThunk, Thunk } from '@/store/types';
import { Nullable } from '@/types';

import * as Actions from './actions';

export const findCreator = (user: string): Thunk<Nullable<Creator>> => async (dispatch) => {
  const { email, userID } = getUserInfoType(user);

  if (!(email || userID)) {
    dispatch(Actions.findCreatorFailed({ error: { errorMessage: 'No creator info given' } }));
  }
  let response;

  try {
    // Get the user object based on whether it is by creator id or by email
    if (email) {
      response = await Admin.getCreatorByEmail(email);
    } else {
      response = await Admin.getCreatorByID(userID!);
    }

    // Set our creator object as well as their boards in the reducer
    dispatch(Actions.setCreator({ creator: response?.creator, boards: Object.values(response?.boards) }));
  } catch (err) {
    toast.error('Error fetching creator');
    dispatch(Actions.findCreatorFailed({ error: { errorMessage: 'Could not find user, something went wrong', errorReturned: err } }));
  }

  return response?.creator ?? null;
};

export const getCharges = (creatorInfo: string): Thunk => async (dispatch) => {
  if (!creatorInfo) {
    return;
  }

  const creator = await dispatch(findCreator(creatorInfo));

  if (creator) {
    try {
      const response = await Admin.getCharges(creator.creator_id);

      dispatch(Actions.setCharges({ charges: response.teams }));
      toast.success('Charges found for user');
    } catch (err) {
      toast.error('Fetch charges failed');
      console.error('Error when getting charges for user: ', err);
    }
  } else {
    toast.error('Unable to find the user');
  }
};

export const getVendors = (creatorInfo: string): Thunk => async (dispatch) => {
  if (!creatorInfo) {
    return;
  }

  const creator = await dispatch(findCreator(creatorInfo));

  if (creator) {
    try {
      const response = await Admin.getVendors(creator.creator_id);
      dispatch(Actions.setVendors({ vendors: response.vendors }));
      toast.success('Vendors found for user');
    } catch (err) {
      toast.error('Fetch vendors failed');
      console.error('Error when getting vendors for user: ', err);
    }
  } else {
    toast.error('Unable to find the user');
  }
};

export const editTrial = (workspaceID: number, date: number): Thunk => async () => {
  if (!workspaceID) {
    return;
  }
  try {
    if (date) {
      // Date should be a timestamp (something like 1429482798)
      // Add one extra day to account for reset at midnight
      const formatDate = moment(date).add(1, 'd').unix();

      await Admin.setTrial(workspaceID, formatDate);
    } else {
      // We want to set the trial expiry to null here
      await Admin.setTrial(workspaceID);
    }
    toast.success("Trial period set! Please refresh the page to see updated charges'");
  } catch (err) {
    toast.error('Trail edit failed.');
  }
};

// Refund a specific user
export const refundCharge = ({
  workspaceID,
  chargeID,
  chargeAmount,
}: {
  workspaceID: number;
  chargeID: string;
  chargeAmount: number;
}): Thunk => async () => {
  if (!workspaceID || !chargeID || !chargeAmount) {
    return;
  }

  try {
    await Admin.refund({
      workspaceID,
      chargeID,
      chargeAmount,
    });
    toast.success('Refund successful! Please refresh the page to see updated charges');
  } catch (err) {
    console.error('error when refunding user: ', err);
    toast.error('Refund failed.');
  }
};

// Cancel a user's subscription
export const cancelSubscription = (workspaceID: number, subscriptionID: string): Thunk => async () => {
  if (!workspaceID || !subscriptionID) {
    return;
  }

  try {
    await Admin.cancelSubscription(workspaceID, subscriptionID);
    toast.success('Subscription cancelled! Refresh to see updated results');
  } catch (err) {
    console.error('error from cancelling subscription', err);
    toast.error('Cancel Subscription Failed');
  }
};

export const updateWorkspaceData = (workspaceID: number, data: Partial<Workspace>): SyncThunk => async (dispatch) => {
  if (!workspaceID) {
    toast.error('Workspace not found');
    return;
  }

  try {
    // Add one extra day to account for reset at midnight
    await Admin.updateWorkspace(workspaceID, data);

    dispatch(Actions.updateWorkspace({ workspaceID, data }));
    toast.success(`Workspace ${Object.keys(data).join(', ')} updated`);
  } catch (err) {
    toast.error('Failed to set the plan.');
  }
};

export const updateWorkspaceMemberRole = ({
  workspaceID,
  creatorID,
  role,
}: {
  workspaceID: number;
  creatorID: number;
  role: string;
}): SyncThunk => async (dispatch) => {
  if (!workspaceID) {
    toast.error('Workspace not found');
    return;
  }
  try {
    // Add one extra day to account for reset at midnight
    await Admin.updateMemberRole({
      workspaceID,
      creatorID,
      role,
    });

    dispatch(Actions.updateWorkspace({ workspaceID, data: { role } }));

    toast.success('The role is updated');
  } catch (err) {
    toast.error('Failed to update the role.');
  }
};

export const getBetaUsers = (): Thunk => async (dispatch) => {
  try {
    const users = await Admin.getBetaUsers();
    dispatch(Actions.setAllBetaUsers({ users }));
  } catch (err) {
    toast.error('There was an error finding the beta user list');
  }
};

export const findBetaCreator = (email: string): Thunk => async (dispatch) => {
  if (!email) {
    dispatch(Actions.findCreatorFailed({ error: { errorMessage: 'No creator info given' } }));
  }

  try {
    const response = await Admin.getCreatorByEmail(email);
    dispatch(
      Actions.setBetaCreator({
        betaCreator: response.creator,
      })
    );
  } catch (err) {
    toast.error('Error finding beta user');
  }
};
