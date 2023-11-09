import type { Story, StoryStatus } from '@voiceflow/dtos';

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

const storyAction = createCRUD('story');

export interface CreateData {
  name: string;
  status: StoryStatus | null;
  flowID: string | null;
  folderID: string | null;
  isEnabled: boolean;
  assigneeID?: number;
  description: string | null;
}

export interface PatchData {
  name?: string;
  status?: StoryStatus | null;
  flowID?: string | null;
  folderID?: string | null;
  isEnabled?: boolean;
  assigneeID?: number;
  description?: string | null;
  triggerOrder?: string[];
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Story>, DesignerAction {}
}

export const CreateOne = storyAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = storyAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = storyAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = storyAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = storyAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Story>, DesignerAction {}

export const Replace = storyAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Story>, DesignerAction {}

export const AddOne = storyAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Story>, DesignerAction {}

export const AddMany = storyAction.crud.addMany<AddMany>();
