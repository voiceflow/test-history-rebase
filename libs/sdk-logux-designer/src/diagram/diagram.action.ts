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

import type { Diagram } from './diagram.interface';

const diagramAction = createCRUD('diagram');

export interface CreateData {
  assistantID: string;
  nodes: Record<string, Diagram.Node>;
}

export interface PatchData {
  nodes?: Record<string, Diagram.Node>;
}

/**
 * user-sent events
 */

/* CreateOne */

export namespace CreateOne {
  export interface Request extends DesignerAction {
    data: CreateData;
  }

  export interface Response extends CreateResponse<Diagram>, DesignerAction {}
}

export const CreateOne = diagramAction.crud.createOne<CreateOne.Request, CreateOne.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData>, DesignerAction {}

export const PatchOne = diagramAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData>, DesignerAction {}

export const PatchMany = diagramAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = diagramAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = diagramAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<Diagram>, DesignerAction {}

export const Replace = diagramAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<Diagram>, DesignerAction {}

export const AddOne = diagramAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<Diagram>, DesignerAction {}

export const AddMany = diagramAction.crud.addMany<AddMany>();
