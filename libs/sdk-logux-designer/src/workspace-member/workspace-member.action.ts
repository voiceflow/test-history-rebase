import { Utils } from '@voiceflow/common';
import type { OrganizationMember, UserRole } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { AddOneRequest, DeleteOneRequest, PatchOneRequest, ReplaceRequest } from '@/crud/crud.interface';

import { WorkspaceMemberAction } from './workspace-member.types';

export const workspaceMemberAction = createCRUD('workspace_member');

/* Add */

export interface AddOne extends AddOneRequest<OrganizationMember>, WorkspaceMemberAction {}

export const AddOne = workspaceMemberAction.crud.addOne<AddOne>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<{ role: UserRole }>, WorkspaceMemberAction {}

export const PatchOne = workspaceMemberAction.crud.patchOne<PatchOne>();

/* Delete One */

export interface DeleteOne extends DeleteOneRequest, WorkspaceMemberAction {}

export const DeleteOne = workspaceMemberAction.crud.deleteOne<PatchOne>();

/* Replace */

export interface Replace extends ReplaceRequest<OrganizationMember>, WorkspaceMemberAction {}

export const Replace = workspaceMemberAction.crud.replace<Replace>();

/* Leave */

export interface Leave {
  creatorID: number;
}

export const Leave = Utils.protocol.createAction<Leave>(workspaceMemberAction('LEAVE'));
