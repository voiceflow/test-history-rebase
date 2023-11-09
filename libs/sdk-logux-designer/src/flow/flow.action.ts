import { Utils } from '@voiceflow/common';
import type { Flow } from '@voiceflow/dtos';

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

export const flowAction = createCRUD('flow');

export interface PatchData {
  name?: string;
  folderID?: string | null;
  description?: string | null;
}

export interface CreateData {
  name: string;
  folderID: string | null;
  description: string | null;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Flow>, DesignerAction {}
}

export const CreateOne = flowAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = flowAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = flowAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = flowAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = flowAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Flow>, DesignerAction {}

export const Replace = flowAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Flow>, DesignerAction {}

export const AddOne = flowAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Flow>, DesignerAction {}

export const AddMany = flowAction.crud.addMany<AddMany>();

/* Activate */

export interface Activate {
  flowID: string;
  diagramID: string;
}

/**
 * called after successfully subscribing to a realtime "assistant-flow" channel
 * this is also called when re-connecting to an existing subscription
 */
export const Activate = Utils.protocol.createAction<Activate>(flowAction('ACTIVATE'));
