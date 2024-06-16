import type { ResponseMessage, ResponseMessageCreate, ResponseMessagePatch } from '@voiceflow/dtos';

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

const responseMessageAction = createCRUD('response_message');

interface BaseCreateData {
  discriminatorID: string;
}

export interface CreateData extends BaseCreateData, ResponseMessageCreate {}

export interface PatchData extends ResponseMessagePatch {}

export interface CreateOptions {
  /**
   * by default variants inserted at position 1 (assume that 0 is reserved for default variant), but in some cases (required entities)
   * we need to insert variant at the start of the list
   */
  discriminatorOrderInsertIndex?: number;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<ResponseMessage>>, DesignerAction {}
}

export const CreateOne = responseMessageAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<ResponseMessage>[]>, DesignerAction {}
}

export const CreateMany = responseMessageAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* Patch */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = responseMessageAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = responseMessageAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = responseMessageAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = responseMessageAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ResponseMessage>, DesignerAction {}

export const Replace = responseMessageAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<ResponseMessage>, DesignerAction {}

export const AddOne = responseMessageAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<ResponseMessage>, DesignerAction {}

export const AddMany = responseMessageAction.crud.addMany<AddMany>();
