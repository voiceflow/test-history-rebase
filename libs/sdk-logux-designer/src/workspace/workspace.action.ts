import { Utils } from '@voiceflow/common';
import type { StripeBillingPeriod, StripePlanType, Workspace } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { AddOneRequest, CreateResponse, DeleteOneRequest, PatchOneRequest } from '@/crud/crud.interface';

import { WorkspaceAction } from './workspace.types';

export const workspaceAction = createCRUD('workspace');

/* CreateOne */

export namespace CreateOne {
  export interface Request extends WorkspaceAction {
    data: Pick<Workspace, 'name' | 'image' | 'organizationID' | 'settings'>;
  }

  export interface Response extends WorkspaceAction, CreateResponse<Workspace> {}
}

export const CreateOne = workspaceAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* Add */

export interface AddOne extends AddOneRequest<Workspace>, WorkspaceAction {}

export const AddOne = workspaceAction.crud.addOne<AddOne>();

/* Patch */
export interface PatchData {
  name?: string;
  image?: string;
}

export interface PatchOne extends PatchOneRequest<PatchData>, WorkspaceAction {}

export const PatchOne = workspaceAction.crud.patchOne<PatchOne>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, WorkspaceAction {}

export const DeleteOne = workspaceAction.crud.deleteOne<DeleteOne>();

/* Downgrade Trial */

export namespace DowngradeTrial {
  export interface Request extends WorkspaceAction {}

  export interface Response extends WorkspaceAction, CreateResponse<null> {}
}

export const DowngradeTrial = Utils.protocol.createAsyncAction<DowngradeTrial.Request, DowngradeTrial.Response>(
  workspaceAction('DOWNGRADE_TRIAL')
);

/* Schedule Seats */
export interface ScheduleSeats {
  seats: number;
}

export const ScheduleSeats = Utils.protocol.createAction<ScheduleSeats>(workspaceAction('SCHEDULE_SEATS'));

/* Update Seats */
export interface UpdateSeats {
  seats: number;
}

export const UpdateSeats = Utils.protocol.createAction<UpdateSeats>(workspaceAction('UPDATE_SEATS'));

/* Checkout */

export namespace Checkout {
  export interface Request extends WorkspaceAction {
    plan: StripePlanType;
    seats: number;
    period: StripeBillingPeriod;
    sourceID: string;
  }

  export interface Response extends WorkspaceAction, CreateResponse<null> {}
}

export const Checkout = Utils.protocol.createAsyncAction<Checkout.Request, Checkout.Response>(
  workspaceAction('CHECKOUT')
);
