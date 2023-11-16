import type { ThreadComment } from '@voiceflow/dtos';

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
import type { LegacyVersionAction } from '@/types';

const commentAction = createCRUD('thread-v2-comment');

export interface CreateData {
  text: string;
  mentions: Array<number>;
  threadID: string;
  authorID: number;
}

export interface PatchData extends Partial<Pick<CreateData, 'text' | 'mentions'>> {}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends LegacyVersionAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<ThreadComment>, LegacyVersionAction {}
}

export const CreateOne = commentAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends LegacyVersionAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<ThreadComment[]>, LegacyVersionAction {}
}

export const CreateMany = commentAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, LegacyVersionAction {}

export const PatchOne = commentAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, LegacyVersionAction {}

export const PatchMany = commentAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, LegacyVersionAction {}

export const DeleteOne = commentAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, LegacyVersionAction {}

export const DeleteMany = commentAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ThreadComment>, LegacyVersionAction {}

export const Replace = commentAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<ThreadComment>, LegacyVersionAction {}

export const AddOne = commentAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<ThreadComment>, LegacyVersionAction {}

export const AddMany = commentAction.crud.addMany<AddMany>();
