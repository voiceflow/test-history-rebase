import { Utils } from '@voiceflow/common';
import type { Thread } from '@voiceflow/dtos';

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

import type { CreateData as ThreadCommentCreateData } from './thread-comment/thread-comment.action';

const threadAction = createCRUD('thread-v2');

export interface CreateData {
  nodeID: string | null;
  comments?: Pick<ThreadCommentCreateData, 'text' | 'mentions' | 'authorID'>[];
  position: [number, number];
  resolved: boolean;
  diagramID: string;
  assistantID: string;
}

export interface PatchData extends Partial<CreateData> {}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends LegacyVersionAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Thread>, LegacyVersionAction {}
}

export const CreateOne = threadAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends LegacyVersionAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<Thread[]>, LegacyVersionAction {}
}

export const CreateMany = threadAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, LegacyVersionAction {}

export const PatchOne = threadAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, LegacyVersionAction {}

export const PatchMany = threadAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, LegacyVersionAction {}

export const DeleteOne = threadAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, LegacyVersionAction {}

export const DeleteMany = threadAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Thread>, LegacyVersionAction {}

export const Replace = threadAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Thread>, LegacyVersionAction {}

export const AddOne = threadAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Thread>, LegacyVersionAction {}

export const AddMany = threadAction.crud.addMany<AddMany>();

/* UpdateUnreadComments */

export const UpdateUnreadComment = Utils.protocol.createAction<boolean>(threadAction('UPDATE_UNREAD_COMMENTS'));
