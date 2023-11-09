import type { Channel, Language, ResponseDiscriminator } from '@voiceflow/dtos';

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

const responseDiscriminatorAction = createCRUD('response_discriminator');

export interface CreateData {
  channel: Channel;
  language: Language;
  responseID: string;
  variantOrder: string[];
}

export interface PatchData {
  variantOrder?: string[];
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<ResponseDiscriminator>, DesignerAction {}
}

export const CreateOne = responseDiscriminatorAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = responseDiscriminatorAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = responseDiscriminatorAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = responseDiscriminatorAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = responseDiscriminatorAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ResponseDiscriminator>, DesignerAction {}

export const Replace = responseDiscriminatorAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface AddOne extends AddOneRequest<ResponseDiscriminator>, DesignerAction {}

export const AddOne = responseDiscriminatorAction.crud.addOne<AddOne>();

/* Add */

export interface AddMany extends AddManyRequest<ResponseDiscriminator>, DesignerAction {}

export const AddMany = responseDiscriminatorAction.crud.addMany<AddMany>();
