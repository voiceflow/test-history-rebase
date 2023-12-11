import type { RequiredEntity, RequiredEntityCreate } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddManyRequest,
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';
import type { DesignerAction } from '@/types';

const requiredEntityAction = createCRUD('required_entity');

export type CreateData = RequiredEntityCreate & { intentID: string };

export interface PatchData {
  repromptID?: string | null;
  entityID?: string;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<RequiredEntity>, DesignerAction {}
}

export const CreateOne = requiredEntityAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<RequiredEntity[]>, DesignerAction {}
}

export const CreateMany = requiredEntityAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = requiredEntityAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = requiredEntityAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = requiredEntityAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = requiredEntityAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<RequiredEntity>, DesignerAction {}

export const Replace = requiredEntityAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<RequiredEntity>, DesignerAction {}

export const AddOne = requiredEntityAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<RequiredEntity>, DesignerAction {}

export const AddMany = requiredEntityAction.crud.addMany<AddMany>();
