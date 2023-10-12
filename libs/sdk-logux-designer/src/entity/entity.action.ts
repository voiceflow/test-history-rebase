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

import type { Entity } from './entity.interface';
import type { EntityVariant } from './entity-variant/entity-variant.interface';

const entityAction = createCRUD('entity');

export interface CreateData {
  name: string;
  color: string;
  isArray: boolean;
  folderID: string | null;
  variants: Pick<EntityVariant, 'value' | 'synonyms'>[];
  classifier: string | null;
  description: string | null;
}

export interface PatchData {
  name?: string;
  color?: string;
  isArray?: boolean;
  folderID?: string | null;
  classifier?: string | null;
  description?: string | null;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Entity>, DesignerAction {}
}

export const CreateOne = entityAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = entityAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = entityAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = entityAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = entityAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Entity>, DesignerAction {}

export const Replace = entityAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Entity>, DesignerAction {}

export const AddOne = entityAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Entity>, DesignerAction {}

export const AddMany = entityAction.crud.addMany<AddMany>();
