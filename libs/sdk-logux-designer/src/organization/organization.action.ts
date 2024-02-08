import type { Organization } from '@voiceflow/dtos';

import type { CreatorAction } from '@/creator/creator.action';
import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteOneRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

export const organizationAction = createCRUD('organization');

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends CreatorAction {
    data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>;
  }

  export interface Response extends CreatorAction, CreateResponse<Organization> {}
}

export const CreateOne = organizationAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

interface PatchData {
  name?: string;
  activePersonaID?: string;
}

export interface PatchOne extends PatchOneRequest<PatchData>, CreatorAction {}

export const PatchOne = organizationAction.crud.patchOne<PatchOne>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, CreatorAction {}

export const DeleteOne = organizationAction.crud.deleteOne<DeleteOne>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Organization>, CreatorAction {}

export const Replace = organizationAction.crud.replace<Replace>();

/**
 * system events
 */

/**
 * universal events
 */

/* Add */

export interface AddOne extends AddOneRequest<Organization>, CreatorAction {}

export const AddOne = organizationAction.crud.addOne<AddOne>();
