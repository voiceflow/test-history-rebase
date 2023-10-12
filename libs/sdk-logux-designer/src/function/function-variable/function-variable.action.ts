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

import type { FunctionVariable } from './function-variable.interface';
import type { FunctionVariableType } from './function-variable-type.enum';

const functionVariableAction = createCRUD('function_variable');

export interface CreateData {
  name: string;
  description: string | null;
  type: FunctionVariableType;
  functionID: string;
}

export interface PatchData {
  name?: string;
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

  export interface Response extends CreateResponse<FunctionVariable>, DesignerAction {}
}

export const CreateOne = functionVariableAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = functionVariableAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = functionVariableAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = functionVariableAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = functionVariableAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<FunctionVariable>, DesignerAction {}

export const Replace = functionVariableAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<FunctionVariable>, DesignerAction {}

export const AddOne = functionVariableAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<FunctionVariable>, DesignerAction {}

export const AddMany = functionVariableAction.crud.addMany<AddMany>();
