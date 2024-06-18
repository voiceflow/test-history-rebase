import { Utils } from '@voiceflow/common';
import type {
  AnyResponseVariantCreate,
  Response as ResponseData,
  ResponseMessageCreate,
  ResponseType,
} from '@voiceflow/dtos';

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

const responseAction = createCRUD('response');

export interface CreateData {
  name: string;
  folderID: string | null;
  variants: AnyResponseVariantCreate[];
  messages?: ResponseMessageCreate[];
  type?: ResponseType;
}

export interface PatchData {
  name?: string;
  folderID?: string | null;
  type?: ResponseType;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<ResponseData>, DesignerAction {}
}

export const CreateOne = responseAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<ResponseData[]>, DesignerAction {}
}

export const CreateMany = responseAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* Duplicate */

export namespace DuplicateOne {
  export interface Request extends DesignerAction {
    data: { responseID: string };
  }

  export interface Response extends DesignerAction {
    data: { responseResource: ResponseData };
  }
}

export const DuplicateOne = Utils.protocol.createAsyncAction<DuplicateOne.Request, DuplicateOne.Response>(
  responseAction('DUPLICATE_ONE')
);

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = responseAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = responseAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = responseAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = responseAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ResponseData>, DesignerAction {}

export const Replace = responseAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<ResponseData>, DesignerAction {}

export const AddOne = responseAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<ResponseData>, DesignerAction {}

export const AddMany = responseAction.crud.addMany<AddMany>();
