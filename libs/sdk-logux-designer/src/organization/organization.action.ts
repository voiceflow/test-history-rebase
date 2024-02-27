import type { Organization } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteOneRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

import { ORGANIZATION_KEY } from './organization.constants';
import type { OrganizationAction } from './organization.types';

export const organizationAction = createCRUD(ORGANIZATION_KEY);

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends OrganizationAction {
    data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>;
  }

  export interface Response extends OrganizationAction, CreateResponse<Organization> {}
}

export const CreateOne = organizationAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

interface PatchData {
  name?: string;
  activePersonaID?: string;
  image?: string;
}

export interface PatchOne extends PatchOneRequest<PatchData>, OrganizationAction {}

export const PatchOne = organizationAction.crud.patchOne<PatchOne>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, OrganizationAction {}

export const DeleteOne = organizationAction.crud.deleteOne<DeleteOne>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Organization> {}

export const Replace = organizationAction.crud.replace<Replace>();

/**
 * system events
 */

/**
 * universal events
 */

/* Add */

export interface AddOne extends AddOneRequest<Organization>, OrganizationAction {}

export const AddOne = organizationAction.crud.addOne<AddOne>();
