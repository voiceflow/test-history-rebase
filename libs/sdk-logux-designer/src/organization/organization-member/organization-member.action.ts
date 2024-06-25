import type { OrganizationMember } from '@voiceflow/dtos';

import type { AddOneRequest, PatchManyRequest, ReplaceRequest } from '@/crud';
import { createCRUD } from '@/crud/crud.action';

import { organizationType } from '../organization.constants';
import type { OrganizationAction } from '../organization.types';

export const organizationMemberAction = createCRUD(organizationType('member'));

/**
 * user-sent events
 */

/* DeleteOne */

export interface DeleteOne extends OrganizationAction {
  id: number;
}

export const DeleteOne = organizationMemberAction.crud.deleteOne<DeleteOne>();

/* Replace */

export interface Replace extends ReplaceRequest<OrganizationMember>, OrganizationAction {}

export const Replace = organizationMemberAction.crud.replace<Replace>();

/* Patch */
export interface PatchMany extends PatchManyRequest<OrganizationMember>, OrganizationAction {}

export const PatchMany = organizationMemberAction.crud.patchMany<PatchMany>();

/* AddOne */
export interface AddOne extends AddOneRequest<OrganizationMember>, OrganizationAction {}

export const AddOne = organizationMemberAction.crud.addOne<AddOne>();
