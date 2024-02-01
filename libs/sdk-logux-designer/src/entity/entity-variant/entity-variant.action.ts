import type { EntityVariant, Language } from '@voiceflow/dtos';

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
import type { DesignerAction, WithoutMeta } from '@/types';

const entityVariantAction = createCRUD('entity_variant');

export interface CreateData {
  language: Language;
  value: string;
  synonyms: string[];
  entityID: string;
}

export interface PatchData {
  value?: string;
  synonyms?: string[];
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<WithoutMeta<EntityVariant>>, DesignerAction {}
}

export const CreateOne = entityVariantAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<WithoutMeta<EntityVariant>[]>, DesignerAction {}
}

export const CreateMany = entityVariantAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = entityVariantAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = entityVariantAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = entityVariantAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = entityVariantAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<EntityVariant>, DesignerAction {}

export const Replace = entityVariantAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<EntityVariant>, DesignerAction {}

export const AddOne = entityVariantAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<EntityVariant>, DesignerAction {}

export const AddMany = entityVariantAction.crud.addMany<AddMany>();
