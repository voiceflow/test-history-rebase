import type { CardButton, Markup } from '@voiceflow/dtos';

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

const cardButtonAction = createCRUD('card_button');

export interface PatchData {
  label?: Markup;
}

export interface CreateData {
  label: Markup;
  cardID: string;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<WithoutMeta<CardButton>>, DesignerAction {}
}

export const Create = cardButtonAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = cardButtonAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = cardButtonAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = cardButtonAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = cardButtonAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<CardButton>, DesignerAction {}

export const Replace = cardButtonAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<CardButton>, DesignerAction {}

export const AddOne = cardButtonAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<CardButton>, DesignerAction {}

export const AddMany = cardButtonAction.crud.addMany<AddMany>();
