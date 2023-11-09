import type { Event } from '@voiceflow/dtos';

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

const eventAction = createCRUD('event');

export interface PatchData {
  name?: string;
  requestName?: string;
  description?: string | null;
  folderID?: string | null;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    name: string;
    requestName: string;
    description: string | null;
    assistantID: string;
    folderID: string | null;
  }

  export interface Response extends CreateResponse<Event> {}
}

export const Create = eventAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = eventAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = eventAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = eventAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = eventAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Event> {}

export const Replace = eventAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<Event> {}

export const Add = eventAction.crud.addOne<Add>();
