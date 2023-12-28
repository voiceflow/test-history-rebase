import type { Intent, RequiredEntityCreate, UtteranceCreate } from '@voiceflow/dtos';

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

const intentAction = createCRUD('intent');

export interface CreateData {
  id?: string;
  name: string;
  folderID: string | null;
  utterances: UtteranceCreate[];
  description: string | null;
  entityOrder: string[];
  requiredEntities: RequiredEntityCreate[];
  automaticReprompt: boolean;
}

export interface PatchData {
  name?: string;
  folderID?: string | null;
  entityOrder?: string[];
  description?: string | null;
  automaticReprompt?: boolean;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Intent>, DesignerAction {}
}

export const CreateOne = intentAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<Intent[]>, DesignerAction {}
}

export const CreateMany = intentAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = intentAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = intentAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = intentAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = intentAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Intent>, DesignerAction {}

export const Replace = intentAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Intent>, DesignerAction {}

export const AddOne = intentAction.crud.addOne<AddOne>();

/* AddOne */

export interface AddMany extends AddManyRequest<Intent>, DesignerAction {}

export const AddMany = intentAction.crud.addMany<AddMany>();
