import type { UserRole } from '@voiceflow/dtos';
import { WorkspaceInvitation } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteOneRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

import { WorkspaceInvitationAction } from './workspace-invitation.types';

export const workspaceInvitationAction = createCRUD('workspace_invitation');

/* Create One */
export namespace CreateOne {
  export interface Request extends WorkspaceInvitationAction {
    data: {
      email: string;
      role: UserRole;
    };
  }

  export interface Response extends WorkspaceInvitationAction, CreateResponse<WorkspaceInvitation> {}
}

export const CreateOne = workspaceInvitationAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* Add */

export interface AddOne extends AddOneRequest<WorkspaceInvitation>, WorkspaceInvitationAction {}

export const AddOne = workspaceInvitationAction.crud.addOne<AddOne>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<{ role: UserRole }>, WorkspaceInvitationAction {}

export const PatchOne = workspaceInvitationAction.crud.patchOne<PatchOne>();

/* Delete One */

export interface DeleteOne extends DeleteOneRequest, WorkspaceInvitationAction {}

export const DeleteOne = workspaceInvitationAction.crud.deleteOne<PatchOne>();

/* Replace */

export interface Replace extends ReplaceRequest<WorkspaceInvitation>, WorkspaceInvitationAction {}

export const Replace = workspaceInvitationAction.crud.replace<Replace>();
