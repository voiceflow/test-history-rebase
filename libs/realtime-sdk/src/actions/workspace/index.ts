import { ClientCRUDPayload, createCRUDActions, getCRUDActionTargets } from '@realtime-sdk/actions/utils';
import { Quota, Workspace, WorkspaceSettings } from '@realtime-sdk/models';
import { BaseCreatorPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { BillingPeriod, PlanType } from '@voiceflow/internal';
import { Action, AnyAction } from 'typescript-fsa';

import { workspaceType } from './utils';

export * as member from './member';
export * as quotas from './quotas';
export * as settings from './settings';

// creation

export interface CreateWorkspacePayload {
  name: string;
  image?: string;
  organizationID?: string;
  settings?: WorkspaceSettings;
}

export const create = Utils.protocol.createAsyncAction<CreateWorkspacePayload, Workspace>(workspaceType('CREATE'));

// crud

export type ClientWorkspaceCRUDPayload = ClientCRUDPayload<Workspace, BaseCreatorPayload>;

export interface LeaveWorkspacePayload extends BaseWorkspacePayload {
  creatorID: number;
}

export interface UpdateWorkspaceNamePayload extends BaseWorkspacePayload {
  name: string;
}

export interface UpdateWorkspaceImagePayload extends BaseWorkspacePayload {
  image: string;
}

export interface EjectUsersPayload extends BaseWorkspacePayload {
  creatorID: number;
}

export interface LOAD_QUOTAS extends BaseWorkspacePayload {
  quotas: Quota[];
}

export interface CheckoutPayload extends BaseWorkspacePayload {
  plan: PlanType;
  seats: number;
  period: BillingPeriod;
  sourceID: string;
}

export interface ChangeSeatsPayload extends BaseWorkspacePayload {
  seats: number;
  schedule?: boolean;
}

export interface DowngradeTrialPayload extends BaseWorkspacePayload {}

export const leave = Utils.protocol.createAction<LeaveWorkspacePayload>(workspaceType('LEAVE'));

export const checkout = Utils.protocol.createAsyncAction<CheckoutPayload, null>(workspaceType('CHECKOUT'));

export const updateName = Utils.protocol.createAction<UpdateWorkspaceNamePayload>(workspaceType('UPDATE_NAME'));

export const changeSeats = Utils.protocol.createAction<ChangeSeatsPayload>(workspaceType('CHANGE_SEATS'));

export const updateImage = Utils.protocol.createAction<UpdateWorkspaceImagePayload>(workspaceType('UPDATE_IMAGE'));

export const downgradeTrial = Utils.protocol.createAsyncAction<DowngradeTrialPayload, null>(workspaceType('DOWNGRADE_TRIAL'));

export const crud = createCRUDActions<Workspace, BaseCreatorPayload>(workspaceType);

// utils

export const getTargetedWorkspaces = (action: AnyAction): string[] | null => {
  const targets = getCRUDActionTargets(crud, action);
  if (targets) return targets;

  const workspaceID = (action as Action<BaseWorkspacePayload | null>).payload?.workspaceID;
  return workspaceID ? [workspaceID] : null;
};
