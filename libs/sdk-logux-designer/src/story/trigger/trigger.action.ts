import type { AnyStoryTrigger, EventStoryTrigger, IntentStoryTrigger } from '@voiceflow/dtos';
import { StoryTriggerTarget } from '@voiceflow/dtos';

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

const triggerAction = createCRUD('trigger');

interface BaseCreateData {
  name: string;
  storyID: string;
}

export interface CreateEventData extends BaseCreateData {
  eventID: string;
}

export interface CreateIntentData extends BaseCreateData {
  intentID: string;
}

export interface BasePatchData {
  name?: string;
}

export type PatchData = BasePatchData &
  ({ intentID?: string; eventID?: never } | { eventID?: string; intentID?: never });

/**
 * user-sent events
 */

/* CreateOneEvent */

export namespace CreateOneEvent {
  export interface Request extends DesignerAction {
    data: CreateEventData;
  }

  export interface Response extends CreateResponse<EventStoryTrigger>, DesignerAction {}
}

export const CreateOneEvent = triggerAction.crud.createOne<CreateOneEvent.Request, CreateOneEvent.Response>(
  StoryTriggerTarget.EVENT
);

/* CreateOneIntent */

export namespace CreateOneIntent {
  export interface Request extends DesignerAction {
    data: CreateIntentData;
  }

  export interface Response extends CreateResponse<IntentStoryTrigger>, DesignerAction {}
}

export const CreateOneIntent = triggerAction.crud.createOne<CreateOneIntent.Request, CreateOneIntent.Response>(
  StoryTriggerTarget.INTENT
);

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = triggerAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = triggerAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = triggerAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = triggerAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<AnyStoryTrigger>, DesignerAction {}

export const Replace = triggerAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<AnyStoryTrigger>, DesignerAction {}

export const AddOne = triggerAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<AnyStoryTrigger>, DesignerAction {}

export const AddMany = triggerAction.crud.addMany<AddMany>();
