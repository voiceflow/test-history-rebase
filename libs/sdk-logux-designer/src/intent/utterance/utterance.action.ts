import type { Utterance, UtteranceCreate, UtteranceText } from '@voiceflow/dtos';

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
import type { DesignerAction, WithoutMeta } from '@/types';

const utteranceAction = createCRUD('utterance');

export interface CreateData extends UtteranceCreate {
  intentID: string;
}

export interface PatchData {
  text?: UtteranceText;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<WithoutMeta<Utterance>>, DesignerAction {}
}

export const CreateOne = utteranceAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* CreateMany */

export namespace CreateMany {
  export interface Request extends DesignerAction {
    data: CreateData[];
  }

  export interface Response extends CreateResponse<WithoutMeta<Utterance>[]>, DesignerAction {}
}

export const CreateMany = utteranceAction.crud.createMany<CreateMany.Request, CreateMany.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = utteranceAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = utteranceAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = utteranceAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = utteranceAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Utterance>, DesignerAction {}

export const Replace = utteranceAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Utterance>, DesignerAction {}

export const AddOne = utteranceAction.crud.addOne<AddOne>();

export interface AddMany extends AddManyRequest<Utterance>, DesignerAction {}

export const AddMany = utteranceAction.crud.addMany<AddMany>();
