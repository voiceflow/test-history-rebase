import { Utils } from '@voiceflow/common';
import type { Function as FunctionType } from '@voiceflow/dtos';

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

const functionAction = createCRUD('function');

export interface CreateData {
  name: string;
  code: string;
  image: string | null;
  folderID: string | null;
  description: string | null;
  pathOrder: string[];
}

export interface PatchData {
  name?: string;
  code?: string;
  image?: string | null;
  folderID?: string | null;
  description?: string | null;
  pathOrder?: string[];
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<FunctionType>, DesignerAction {}
}

export const CreateOne = functionAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = functionAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = functionAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = functionAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = functionAction.crud.deleteMany<DeleteMany>();

/* Duplicate */

export namespace DuplicateOne {
  export interface Request extends DesignerAction {
    data: { functionID: string };
  }

  export interface Response extends DesignerAction {
    data: { functionResource: FunctionType };
  }
}

export const DuplicateOne = Utils.protocol.createAsyncAction<DuplicateOne.Request, DuplicateOne.Response>(
  functionAction('DUPLICATE_ONE')
);

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<FunctionType>, DesignerAction {}

export const Replace = functionAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<FunctionType>, DesignerAction {}

export const AddOne = functionAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<FunctionType>, DesignerAction {}

export const AddMany = functionAction.crud.addMany<AddMany>();

/* ImportMany */

export namespace CreateOneFromTemplate {
  export interface Request extends DesignerAction {
    data: {
      templateID: string;
      name: string;
      description: string;
    };
  }

  export interface Response extends DesignerAction {
    data: FunctionType;
  }
}

export const CreateOneFromTemplate = Utils.protocol.createAsyncAction<
  CreateOneFromTemplate.Request,
  CreateOneFromTemplate.Response
>(functionAction('CREATE_ONE_FROM_TEMPLATE'));
