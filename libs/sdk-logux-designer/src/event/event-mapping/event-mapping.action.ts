import type { EventMapping, Markup } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

const eventMappingAction = createCRUD('event_mapping');

export interface PatchData {
  path?: Markup;
  variableID?: string | null;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    path: Markup;
    variableID: string | null;
    eventID: string;
    assistantID: string;
  }

  export interface Response extends CreateResponse<EventMapping> {}
}

export const Create = eventMappingAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = eventMappingAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = eventMappingAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = eventMappingAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = eventMappingAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<EventMapping> {}

export const Replace = eventMappingAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<EventMapping> {}

export const Add = eventMappingAction.crud.addOne<Add>();
