import type { Markup } from '@/common';
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

import type { Prompt } from './prompt.interface';

const promptAction = createCRUD('prompt');

export interface CreateData {
  name: string;
  text: Markup;
  folderID: string | null;
  personaID: string | null;
}

export interface PatchData {
  name?: string;
  text?: Markup;
  personaID?: string | null;
  folderID?: string | null;
}

/**
 * user-sent events
 */

/* Create One */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Prompt>, DesignerAction {}
}

export const CreateOne = promptAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = promptAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = promptAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = promptAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = promptAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Prompt>, DesignerAction {}

export const Replace = promptAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface AddOne extends AddOneRequest<Prompt>, DesignerAction {}

export const AddOne = promptAction.crud.addOne<AddOne>();

export interface AddMany extends AddManyRequest<Prompt>, DesignerAction {}

export const AddMany = promptAction.crud.addMany<AddMany>();
