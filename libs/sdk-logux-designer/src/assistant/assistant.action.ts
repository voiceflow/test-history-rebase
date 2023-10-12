import { Utils } from '@voiceflow/common';

import type { Assistant } from '@/assistant/assistant.interface';
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
import type { WorkspaceAction } from '@/workspace/workspace.action';

export const assistantAction = createCRUD('assistant');

interface PatchData {
  name?: string;
  activePersonaID?: string;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request extends WorkspaceAction {
    data: { name: string };
  }

  export interface Response extends CreateResponse<Assistant>, WorkspaceAction {}
}

export const Create = assistantAction.crud.createOne<Create.Request, Create.Response>();

interface PatchData {
  name?: string;
}

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, WorkspaceAction {}

export const PatchOne = assistantAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, WorkspaceAction {}

export const PatchMany = assistantAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, WorkspaceAction {}

export const DeleteOne = assistantAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, WorkspaceAction {}

export const DeleteMany = assistantAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Assistant>, WorkspaceAction {}

export const Replace = assistantAction.crud.replace<Replace>();

/* Activate */

export interface Activate {
  assistantID: string;
  workspaceID: string;
}

/**
 * called after successfully subscribing to a realtime "assistant" channel
 * this is also called when re-connecting to an existing subscription
 */
export const Activate = Utils.protocol.createAction<Activate>(assistantAction('ACTIVATE'));

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<Assistant>, WorkspaceAction {}

export const Add = assistantAction.crud.addOne<Add>();
