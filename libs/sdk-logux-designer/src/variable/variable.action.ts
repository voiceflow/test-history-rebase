import type { Variable, VariableDatatype } from '@voiceflow/dtos';

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

const variableAction = createCRUD('variable');

export interface CreateData {
  name: string;
  color: string;
  isArray: boolean;
  folderID: string | null;
  datatype: VariableDatatype;
  description: string | null;
  defaultValue: string | null;
}

export interface PatchData {
  name?: string;
  color?: string;
  isArray?: boolean;
  folderID?: string | null;
  datatype?: VariableDatatype;
  description?: string | null;
  defaultValue?: string | null;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Variable>, DesignerAction {}
}

export const CreateOne = variableAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<Variable[]>, DesignerAction {}
}

export const CreateMany = variableAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = variableAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = variableAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = variableAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = variableAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Variable>, DesignerAction {}

export const Replace = variableAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Variable>, DesignerAction {}

export const AddOne = variableAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Variable>, DesignerAction {}

export const AddMany = variableAction.crud.addMany<AddMany>();
