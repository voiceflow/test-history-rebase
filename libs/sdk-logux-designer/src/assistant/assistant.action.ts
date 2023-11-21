import { Utils } from '@voiceflow/common';
import type { Assistant } from '@voiceflow/dtos';

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

/* CreateOne */

export namespace CreateOne {
  export interface Request extends WorkspaceAction {
    data: { name: string };
  }

  export interface Response extends CreateResponse<Assistant>, WorkspaceAction {}
}

export const CreateOne = assistantAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* Duplicate */

export namespace Duplicate {
  export interface Request extends WorkspaceAction {
    data: { assistantID: string };
  }

  export interface Response extends CreateResponse<Assistant>, WorkspaceAction {}
}

export const DuplicateOne = Utils.protocol.createAsyncAction<Duplicate.Request, Duplicate.Response>(
  assistantAction('DUPLICATE_ONE')
);

/* PatchOne */

interface PatchData {
  name?: string;
}

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

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<Assistant>, WorkspaceAction {}

export const Add = assistantAction.crud.addOne<Add>();
