import type { Folder, FolderScope } from '@voiceflow/dtos';

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

const folderAction = createCRUD('folder');

export interface PatchData {
  name?: string;
  parentID?: string | null;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    name: string;
    scope: FolderScope;
    parentID: string | null;
    assistantID: string;
  }

  export interface Response extends CreateResponse<Folder> {}
}

export const Create = folderAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = folderAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = folderAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = folderAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = folderAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Folder> {}

export const Replace = folderAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<Folder> {}

export const Add = folderAction.crud.addOne<Add>();
